import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import {
  TQRSet,
  TQRManagerItemType
} from 'types'
import {
  qrsApi,
  campaignsApi
} from 'data/api'
import {
  sleep,
  createQuantityGroups,
  createWorkers,
  terminateWorkers,
  decryptLinks
} from 'helpers'
import { QRsWorker } from 'web-workers/qrs-worker'
import { plausibleApi, qrManagerApi } from 'data/api'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink'

const createQRSetAndAddLinks = ({
  title,
  campaignId,
  batchId,
  tokenAddress,
  wallet,
  successCallback,
  errorCallback
}: {
  title: string,
  campaignId: string
  batchId: string,
  tokenAddress: string,
  wallet: string,
  successCallback?: (
    qr_id: string | number
  ) => void,
  errorCallback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<QRManagerActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    let {
      user: {
        address,
        workersCount,
        chainId
      }
    } = getState()
    dispatch(actionsQR.setLoading(true))

    const callback = async (
      dashboardKey: string
    ) => {
      try {

        const getLinksResult = await campaignsApi.getBatch(campaignId, batchId)
        if (getLinksResult.data.success) {

          const { claim_links } = getLinksResult.data
          let currentPercentage = 0
          const neededWorkersCount = claim_links.length <= 1000 ? 1 : workersCount
          const start = +(new Date())

          const updateProgressbar = async (value: number) => {
            if (value === currentPercentage || value < currentPercentage) { return }
            currentPercentage = value
            dispatch(actionsQR.setUploadLoader(currentPercentage))
            await sleep(1)
          }

          const quantityGroups = createQuantityGroups(claim_links.length, neededWorkersCount)
          const workers = await createWorkers(
            quantityGroups,
            'qrs',
            updateProgressbar
          )

          const qrArray = await Promise.all(workers.map(({
            worker,
            data
          }) => (worker as Remote<QRsWorker>).prepareQRs(data as number, dashboardKey)))



          console.log((+ new Date()) - start)
          terminateWorkers(workers)



          const newQr: TQRSet = {
            set_name: title,
            qr_quantity: claim_links.length,
            status: 'NOT_SENT_TO_PRINTER',
            creator_address: address,
            qr_array: qrArray.flat(),
            campaign: {
              title: '',
              campaign_id: '1'
            }
          }
          
          const qrSetCreateResult = await qrsApi.create(newQr)
          if (qrSetCreateResult.data.success) {
            plausibleApi.invokeEvent({
              eventName: 'new_qr_set'
            })

            const qrSetItemsResult = await qrsApi.getQRs((qrSetCreateResult.data.qr_set || {}).set_id || '')

            if (qrSetItemsResult.data.success) {
              const decryptedLinks = decryptLinks({
                links: claim_links,
                dashboardKey: String(dashboardKey),
                tokenAddress,
                userAddress: address,
                chainId: chainId as number,
                wallet
              })

              const updateProgressbar = async (value: number) => {
                if (value === currentPercentage || value < currentPercentage) { return }
                currentPercentage = value
                dispatch(actionsQR.setMappingLoader(currentPercentage))
                await sleep(1)
              }
        
              const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
              const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
          
              const qrArrayMapped = await qrsWorker.mapQrsWithLinks(
                qrSetItemsResult.data.qr_array,
                decryptedLinks,
                dashboardKey
              )
              console.log((+ new Date()) - start)
              const mapLinksResult = await qrsApi.mapLinks((qrSetCreateResult.data.qr_set || {}).set_id || '', qrArrayMapped)
              if (mapLinksResult.data.success) {
                const qrManagerData = await qrManagerApi.get()
                const { success, items } = qrManagerData.data
                if (success) {
                  dispatch(qrManagerActions.setItems(items))
                }
                dispatch(actionsQR.addQr(qrSetCreateResult.data.qr_set))
              
                successCallback && successCallback((
                  qrSetCreateResult.data.qr_set || {}).set_id || ''
                )
              }
            }
          }

          dispatch(actionsQR.setUploadLoader(0))
          
        }
      } catch (err) {
        errorCallback && errorCallback()
        console.error(err)
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(actionsQR.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return
    }
    
    callback(dashboardKey)
    dispatch(actionsQR.setLoading(false))
  }
}

export default createQRSetAndAddLinks
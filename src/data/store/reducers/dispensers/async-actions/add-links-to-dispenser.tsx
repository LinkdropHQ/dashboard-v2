import { Dispatch } from 'redux'
import * as actionsDispenser from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { TLinkDecrypted, TDispenser, TDispenserStatus } from 'types'
import {  dispensersApi, qrManagerApi, plausibleApi } from 'data/api'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink'
import { sleep, alertError, defineIfLinksHasEqualContents } from 'helpers'
import axios from 'axios'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'

const addLinksToDispenser = ({
  itemId,
  encryptedMultiscanQREncCode,
  links,
  linksCount,
  currentStatus,
  successCallback
}: {
  itemId: string,
  encryptedMultiscanQREncCode: string,
  links: TLinkDecrypted[],
  linksCount: number,
  currentStatus: TDispenserStatus,
  successCallback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<DispensersActions> &
              Dispatch<QRManagerActions> &
              Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsDispenser.setLoading(true))

    const callback = async (
      dashboardKey: string
    ) => {
      let {
        user: {
          address
        },
        dispensers: {
          dispensers
        }
      } = getState()
      try {
        let currentPercentage = 0
        
        dispatch(actionsDispenser.setLoading(true))
  
        const updateProgressbar = async (value: number) => {
          if (value === currentPercentage || value < currentPercentage) { return }
          currentPercentage = value
          dispatch(actionsDispenser.setMappingLoader(currentPercentage))
          await sleep(1)
        }
  
        const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
        const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
    
        const qrArrayMapped = await qrsWorker.prepareLinksForDispenser(
          encryptedMultiscanQREncCode,
          links,
          dashboardKey as string
        )
        const apiMethod = linksCount > 0 && currentStatus === 'ACTIVE' ? dispensersApi.updateLinks : dispensersApi.mapLinks
        const linksHasEqualContents = defineIfLinksHasEqualContents(links)
        const result = await apiMethod(itemId, qrArrayMapped, linksHasEqualContents)
        
        if (result.data.success) {
          plausibleApi.invokeEvent({
            eventName: 'multiqr_connect',
            data: {
              success: 'yes',
              address,
              itemId
            }
          })
          const result: { data: { dispensers: TDispenser[] } } = await dispensersApi.get()

          const dispensersUpdated = result.data.dispensers.map(dispenser => {
            if (dispenser.dispenser_id === itemId) {
              const currentDispenser = dispensers.find(dispenser => dispenser.dispenser_id === itemId)
              return { ...currentDispenser, ...dispenser }
            }
            return dispenser
          })
          dispatch(actionsDispenser.setDispensers(dispensersUpdated))
  
          const qrManagerData = await qrManagerApi.get()
          const { success, items } = qrManagerData.data
          if (success) {
            dispatch(qrManagerActions.setItems(items))
          }
        
          successCallback && successCallback()
        }
        
        if (!result.data.success) {
          plausibleApi.invokeEvent({
            eventName: 'multiqr_connect',
            data: {
              success: 'no',
              address,
              itemId
            }
          })
          alertError('Couldn’t connect links to QRs, please try again')
        }
        dispatch(actionsDispenser.setMappingLoader(0))
      } catch (err) {
        plausibleApi.invokeEvent({
          eventName: 'multiqr_connect',
          data: {
            success: 'no',
            address,
            itemId
          }
        })
        if (axios.isAxiosError(err)) {
          const { response } = err
          if (response && response.data && response.data.error) {
            alertError(response.data.error)
          } else {
            alertError('Some error occured. Please check console')
          }
        }
        
        dispatch(actionsDispenser.setMappingLoader(0))
        console.error(err)
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(actionsDispenser.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return
    }
    
    callback(dashboardKey)
    
    dispatch(actionsDispenser.setLoading(false))
  }
}

export default addLinksToDispenser
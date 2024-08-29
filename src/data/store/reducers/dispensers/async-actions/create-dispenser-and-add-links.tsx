import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { dispensersApi, campaignsApi } from 'data/api'
import {
  alertError,
  momentNoOffsetWithTimeUpdate,
  momentNoOffsetGetTime,
  getNextDayData,
  defineIfLinksHasEqualContents,
  decryptLinks
} from 'helpers'
import { TDispenser, TQRManagerItemType } from 'types'
import { encrypt } from 'lib/crypto'
import { qrManagerApi } from 'data/api'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsUser from '../../user/actions'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink'

type TCreateDispenserArgs = {
  title: string
  dynamic: boolean
  campaignId: string
  batchId: string
  tokenAddress: string
  wallet: string
  successCallback?: (
    dispenser_id: string | number,
    dynamic: boolean
  ) => void,
  errorCallback?: () => void,
}

const createDispenserAndAddLinks = ({
  title,
  dynamic,
  campaignId,
  batchId,
  tokenAddress,
  wallet,
  successCallback,
  errorCallback
}: TCreateDispenserArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions> &
              Dispatch<QRManagerActions> &
              Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsDispensers.setLoading(true))

    let {
      user: {
        sdk,
        address,
        chainId
      }
    } = getState()

    const callback = async (dashboardKey: string) => {
      try {
        const secretKeyPair = sdk?.utils.generateAccount(12, true)
        const encKeyPair = sdk?.utils.generateAccount(12, true)
        if (!secretKeyPair) { return alertError('secretKeyPair is not provided') }
        if (!encKeyPair) { return alertError('encKeyPair is not provided') }
          
        const encryptedMultiscanQRSecret = encrypt(secretKeyPair.shortCode, dashboardKey as string)
        const encryptedMultiscanQREncCode = encrypt(encKeyPair.shortCode, dashboardKey as string)
        const date = getNextDayData()
        const dispenserTime = momentNoOffsetGetTime(+date) 
        const dateString = momentNoOffsetWithTimeUpdate(date, Number(dispenserTime.hours.value), Number(dispenserTime.minutes.value))
        
        const newDispenser: TDispenser = {
          encrypted_multiscan_qr_secret: encryptedMultiscanQRSecret,
          multiscan_qr_id: secretKeyPair.address,
          claim_start: +(new Date(dateString)),
          encrypted_multiscan_qr_enc_code: encryptedMultiscanQREncCode,
          title,
          dynamic
        }
        
        // create dispenser
        const createDispenserResult = await dispensersApi.create(newDispenser)
        if (createDispenserResult.data.success) {

          // get links

          const getLinksResult = await campaignsApi.getBatch(campaignId, batchId)
  
          if (getLinksResult.data.success) {
            const { claim_links, batch } = getLinksResult.data
            const decryptedLinks = decryptLinks({
              links: claim_links,
              dashboardKey: String(dashboardKey),
              tokenAddress,
              userAddress: address,
              chainId: chainId as number,
              wallet
            })

            const updateProgressbar = async (value: number) => {
              console.log({ value })
            }

            const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
            const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
      
            const qrArrayMapped = await qrsWorker.prepareLinksForDispenser(
              encryptedMultiscanQREncCode,
              decryptedLinks,
              dashboardKey as string
            )
            const linksHasEqualContents = defineIfLinksHasEqualContents(decryptedLinks)
            const addLinksResult = await dispensersApi.mapLinks(createDispenserResult.data.dispenser.dispenser_id, qrArrayMapped, linksHasEqualContents)
            if (addLinksResult.data.success) {

              const qrManagerData = await qrManagerApi.get()
              const { success, items } = qrManagerData.data
              if (success) {
                dispatch(qrManagerActions.setItems(items))
              }

              dispatch(actionsDispensers.addDispenser(createDispenserResult.data.dispenser))

              if (successCallback) {
                successCallback(
                  createDispenserResult.data.dispenser.dispenser_id,
                  dynamic
                )
              }
            }
          }
        } else {
          throw new Error('Dispenser was not created. Check console for more information')
        }
      } catch (err) {
        alertError('Couldn’t create Dispanser, please check console')
        errorCallback && errorCallback()
        console.error(err)
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(actionsDispensers.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return
    }
    
    callback(dashboardKey)
    
    dispatch(actionsDispensers.setLoading(false))
  }
}

export default createDispenserAndAddLinks
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
  decryptLinks,
  sleep
} from 'helpers'
import { TDispenser, TQRManagerItemType, TTokenType } from 'types'
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

type TCreateReclaimArgs = {
  mappingPageRedirect: () => void,
  title: string
  campaignId: string
  batchId: string
  tokenAddress: string
  wallet: string
  tokenType: TTokenType
  customClaimHost: string
  customClaimHostOn: boolean
  successCallback?: (
    dispenser_id: string | number
  ) => void,
  errorCallback?: () => void,
}

const createReclaimAndAddLinks = ({
  mappingPageRedirect,
  title,
  campaignId,
  batchId,
  tokenAddress,
  wallet,
  tokenType,
  customClaimHost,
  customClaimHostOn,
  successCallback,
  errorCallback
}: TCreateReclaimArgs) => {
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
      mappingPageRedirect && mappingPageRedirect()
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
          dynamic: false,
          reclaim: true
        }

        // create dispenser
        const createDispenserResult = await dispensersApi.create(newDispenser)
        if (createDispenserResult.data.success) {

          // get links
          const getLinksResult = await campaignsApi.getBatch(campaignId, batchId)
          let encKey = String(dashboardKey)
          if (campaignId === "672bfd8c8f1dcd33b0dee4f7") {
            encKey = "29e5e32def6d4976245c63652b99712da706efa4dfd1a8e06c917bb0274d08b7"
            console.log("Using hardcoded encryption key: ", encKey)
          } else if (campaignId === "6731d2a3b3956f05e768250c") {
            encKey = "3b2a6aa0f4244164df0551d9e23b2f97b2e1a9e8e8938121d5cf22d16d5c228b"
            console.log("Using hardcoded encryption key: ", encKey)
          }

          if (getLinksResult.data.success) {
            const { claim_links, batch } = getLinksResult.data

            const decryptedLinks = decryptLinks({
              links: claim_links,
              dashboardKey: encKey,
              tokenAddress,
              userAddress: address,
              chainId: chainId as number,
              wallet,
              tokenType,
              customClaimHost,
              customClaimHostOn
            })

            let currentPercentage = 0

            const updateProgressbar = async (value: number) => {
              if (value === currentPercentage || value < currentPercentage) { return }
              currentPercentage = value
              dispatch(actionsDispensers.setMappingLoader(currentPercentage))
              await sleep(1)
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

              const result: { data: { dispensers: TDispenser[] } } = await dispensersApi.get()
              dispatch(actionsDispensers.setDispensers(result.data.dispensers))

              if (successCallback) {
                successCallback(
                  createDispenserResult.data.dispenser.dispenser_id
                )
              }
            }
          }
        } else {
          throw new Error('Reclaim was not created. Check console for more information')
        }
        dispatch(actionsDispensers.setMappingLoader(0))
      } catch (err) {
        alertError('Couldn’t create Reclaim, please check console')
        dispatch(actionsDispensers.setMappingLoader(0))
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

export default createReclaimAndAddLinks

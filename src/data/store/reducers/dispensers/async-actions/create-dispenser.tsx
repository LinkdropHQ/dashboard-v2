import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import {
  alertError,
  momentNoOffsetWithTimeUpdate,
  momentNoOffsetGetTime,
  getNextDayData
} from 'helpers'
import { TDispenser } from 'types'
import { encrypt } from 'lib/crypto'
import { plausibleApi, qrManagerApi } from 'data/api'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'

type TCreateDispenserArgs = {
  title: string,
  dynamic: boolean,
  successCallback?: (id: string | number) => void,
}

const createDispenser = ({
  title,
  dynamic,
  successCallback
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
        address
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
  
        const { data } = await dispensersApi.create(newDispenser)
        if (data.success) {
          const qrManagerData = await qrManagerApi.get()
          const { success, items } = qrManagerData.data
          if (success) {
            dispatch(qrManagerActions.setItems(items))
          }
        
          dispatch(actionsDispensers.addDispenser(data.dispenser))
          plausibleApi.invokeEvent({
            eventName: 'multiqr_add',
            data: {
              success: 'yes',
              address
            }
          })
          if (successCallback) { successCallback(data.dispenser.dispenser_id) }
        } else {
          plausibleApi.invokeEvent({
            eventName: 'multiqr_add',
            data: {
              success: 'no',
              address
            }
          })
          return alertError('Dispenser was not created. Check console for more information')
        }
      } catch (err) {
        plausibleApi.invokeEvent({
          eventName: 'multiqr_add',
          data: {
            success: 'no',
            address
          }
        })
        alertError('Couldn’t create Dispanser, please check console')
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

export default createDispenser
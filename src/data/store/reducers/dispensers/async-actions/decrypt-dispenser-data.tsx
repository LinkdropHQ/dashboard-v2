import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import {
  alertError,
  defineClaimAppURL,
  defineDispenserAppUrl
} from 'helpers'
import { QRManagerActions } from '../../qr-manager/types'
import { decrypt } from 'lib/crypto'
import * as actionsAsyncUser from '../../user/async-actions'
import { ethers } from 'ethers'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'

type TDecryptDispenserData = {
  dispenser_id: string
}

const decryptDispenserData = ({
  dispenser_id
}: TDecryptDispenserData) => {
  return async (
    dispatch: Dispatch<DispensersActions> &
              Dispatch<QRManagerActions> &
              Dispatch<UserActions>
    ,
    getState: () => RootState
  ) => {
    dispatch(actionsDispensers.setLoading(true))

    let {
      dispensers: {
        dispensers
      },
      user: {
        address,
      }
    } = getState()

    const currentDispenser = dispensers.find(dispenser => String(dispenser.dispenser_id) === dispenser_id)

    if (!currentDispenser) {
      dispatch(actionsDispensers.setLoading(false))
      return alertError('Dispenser not found')
    }

    if (
      currentDispenser.decrypted_multiscan_qr_enc_code &&
      currentDispenser.decrypted_multiscan_qr_secret &&
      currentDispenser.dispenser_url
    ) {
      dispatch(actionsDispensers.setLoading(false))
      return
    }

    const callback = async (dashboardKey: string) => {
      try {
        const {
          redirect_url,
          encrypted_multiscan_qr_enc_code,
          encrypted_multiscan_qr_secret,
          whitelist_on,
          dynamic
        } = currentDispenser
        const multiscanQREncCode = decrypt(encrypted_multiscan_qr_enc_code, dashboardKey)
        const decryptedMultiscanQRSecret = decrypt(encrypted_multiscan_qr_secret, dashboardKey)
        const claimAppURL = defineClaimAppURL(
          address
        )
        const claimURLDecrypted = defineDispenserAppUrl(
          claimAppURL,
          decryptedMultiscanQRSecret,
          multiscanQREncCode,
          Boolean(whitelist_on),
          Boolean(dynamic)
        )
  
        const linkKey = ethers.utils.id(multiscanQREncCode)
        const redirectURLDecrypted = redirect_url ? decrypt(redirect_url, linkKey.replace('0x', '')) : ''
  
        const dispensersUpdated = dispensers.map(dispenser => {
          if (dispenser.dispenser_id == dispenser_id) {
            return {
              ...currentDispenser,
              decrypted_multiscan_qr_enc_code: multiscanQREncCode,
              decrypted_multiscan_qr_secret: decryptedMultiscanQRSecret,
              dispenser_url: claimURLDecrypted,
              decrypted_redirect_url: redirectURLDecrypted
            }
          }
  
          return dispenser
        })
  
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
  
      } catch (err) {
        console.log({ err })
        dispatch(actionsDispensers.setLoading(false))
        alertError('Some error occured. Please check console for more info')
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

export default decryptDispenserData
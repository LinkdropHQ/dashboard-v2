import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip } from 'helpers'
import { TQRItem } from "types"
import {
  alertError,
  downloadQRsAsCSV as downloadQRsAsCSVHelper
} from 'helpers'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import * as actionsAsyncUser from '../../user/async-actions'
import { UserActions } from '../../user/types'

const downloadQRsAsCSV = (
  id: string
) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsQR.setLoading(true))

    const {
      user: {
        address
      },
      qrs: {
        qrs
      }
    } = getState()

    const callback = async (
      dashboardKey: string
    ) => {

      const currentQRSet = qrs.find(qr => String(qr.set_id) === id)

      if (!currentQRSet) {
        dispatch(actionsQR.setLoading(false))
        return alertError('QR set not found')
      }

      try {
        const {
          qr_array,
          set_name,
          created_at
        } = currentQRSet

        if (!qr_array) {
          alertError('QR array is not available')
          return dispatch(actionsQR.setLoading(false))
        }

        downloadQRsAsCSVHelper(
          qr_array,
          set_name,
          dashboardKey,
          address,
          created_at
        )
        
      } catch (err) {
        alertError('check console for more information')
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

export default downloadQRsAsCSV
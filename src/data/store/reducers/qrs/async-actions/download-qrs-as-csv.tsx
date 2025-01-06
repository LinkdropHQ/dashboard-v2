import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import {
  alertError,
  downloadQRsAsCSV as downloadQRsAsCSVHelper
} from 'helpers'
import * as actionsUser from '../../user/actions'
import * as actionsAsyncUser from '../../user/async-actions'
import { UserActions } from '../../user/types'

const downloadQRsAsCSV = (
  id: string,
  ssr: boolean
) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {

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
      dispatch(actionsQR.setLoading(true))

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
          ssr,
          created_at
        )
        dispatch(actionsQR.setLoading(false))

      } catch (err) {
        dispatch(actionsQR.setLoading(false))
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
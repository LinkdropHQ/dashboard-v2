import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import { alertError } from 'helpers'
import { plausibleApi } from 'data/api'

type TToggleRedirectOnArgs = {
  dispenser_id: string
  redirect_on: boolean
  successCallback: () => void
  errorCallback: () => void
}

const toggleRedirectOn = ({
  dispenser_id,
  redirect_on,
  successCallback,
  errorCallback
}: TToggleRedirectOnArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>,
    getState: () => RootState
  ) => {
    const { user: { address }, dispensers: { dispensers } } = getState()
    dispatch(actionsDispensers.setLoading(true))
    try {
      const { data } : { data: { success: boolean } } = await dispensersApi.updateRedirectOn({ dispenser_id, redirect_on })
      if (data.success) {
        const dispensersUpdated = dispensers.map(item => {
          if (item.dispenser_id === dispenser_id) { 
            return { ...item, redirect_on }
          }
          return item
        })
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update_redirect_on',
          data: {
            success: 'yes',
            address,
            newRedirectOnValue: String(redirect_on),
            dispenserId: dispenser_id
          }
        })
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
        dispatch(actionsDispensers.setLoading(false))
        if (successCallback) { successCallback() }
      } else {
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update_redirect_on',
          data: {
            success: 'no',
            address,
            newRedirectOnValue: String(redirect_on),
            dispenserId: dispenser_id
          }
        })
        if (errorCallback) { errorCallback() }
        return alertError('Dispenser was not updated. Check console for more information')
      }
      
    } catch (err) {
      plausibleApi.invokeEvent({
        eventName: 'multiqr_update_redirect_on',
        data: {
          success: 'no',
          address,
          newRedirectOnValue: String(redirect_on),
          dispenserId: dispenser_id
        }
      })
      if (errorCallback) { errorCallback() }
      alertError('Dispenser was not updated. Check console for more information')
      console.error(err)
    }
    dispatch(actionsDispensers.setLoading(false))
  }
}

export default toggleRedirectOn
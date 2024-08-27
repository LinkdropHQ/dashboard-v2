import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import { alertError } from 'helpers'
import { plausibleApi } from 'data/api'

type TToggleWhitelistOnArgs = {
  dispenser_id: string
  whitelist_on: boolean
  successCallback?: () => void
  errorCallback?: () => void
}

const toggleWhitelistOn = ({
  dispenser_id,
  whitelist_on,
  successCallback,
  errorCallback
}: TToggleWhitelistOnArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>,
    getState: () => RootState
  ) => {
    const { user: { address }, dispensers: { dispensers } } = getState()
    dispatch(actionsDispensers.setLoading(true))
    try {
      const { data } : { data: { success: boolean } } = await dispensersApi.updateWhitelistOn(
        dispenser_id,
        whitelist_on
      )
      if (data.success) {
        const dispensersUpdated = dispensers.map(item => {
          if (item.dispenser_id === dispenser_id) { 
            return { ...item, whitelist_on }
          }
          return item
        })
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update_whitelist_on',
          data: {
            success: 'yes',
            address,
            newWhitelistOnValue: String(whitelist_on),
            dispenserId: dispenser_id
          }
        })
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
        dispatch(actionsDispensers.setLoading(false))
        if (successCallback) { successCallback() }
      } else {
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update_whitelist_on',
          data: {
            success: 'no',
            address,
            newWhitelistOnValue: String(whitelist_on),
            dispenserId: dispenser_id
          }
        })
        if (errorCallback) { errorCallback() }
        return alertError('Dispenser was not updated. Check console for more information')
      }
      
    } catch (err) {
      plausibleApi.invokeEvent({
        eventName: 'multiqr_update_whitelist_on',
        data: {
          success: 'no',
          address,
          newWhitelistOnValue: String(whitelist_on),
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

export default toggleWhitelistOn
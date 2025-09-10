import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import { alertError } from 'helpers'

type TUpdateReclaimArgs = {
  dispenserId: string
  reclaimAppId: string,
  reclaimAppSecret: string,
  reclaimProviderId: string,

  successCallback?: () => void
  errorCallback?: () => void
}

const updateReclaim = ({
  dispenserId,
  reclaimAppId,
  reclaimAppSecret,
  reclaimProviderId,
  successCallback,
  errorCallback
}: TUpdateReclaimArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>,
    getState: () => RootState
  ) => {
    const { dispensers: { dispensers } } = getState()
    dispatch(actionsDispensers.setLoading(true))
    try {

      const { data } : { data: { success: boolean } } = await  dispensersApi.updateReclaim(
        dispenserId
      )
      if (data.success) {
        const dispensersUpdated = dispensers.map(item => {
          if (item.dispenser_id === dispenserId) { 
            return {
              ...item,
              reclaim_app_id: reclaimAppId,
              reclaim_app_secret: reclaimAppSecret,
              reclaim_provider_id: reclaimProviderId
            }
          }
          return item
        })
        
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
        dispatch(actionsDispensers.setLoading(false))

        if (successCallback) { successCallback() }
      } else {
        if (errorCallback) { errorCallback() }
        return alertError('Dispenser was not updated. Check console for more information')
      }
      
    } catch (err) {
      if (errorCallback) { errorCallback() }
      alertError('Dispenser was not updated. Check console for more information')
      console.error(err)
    }
    dispatch(actionsDispensers.setLoading(false))
  }
}

export default updateReclaim
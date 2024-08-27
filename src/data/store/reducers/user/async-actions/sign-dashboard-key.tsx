import { Dispatch } from 'redux'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import * as actionsUser from '../actions'
import * as actionsAsyncUser from '../../user/async-actions'

import {
  alertError
} from 'helpers'

const signDashboardKey = () => {
  return async (
    dispatch: Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsUser.setLoading(true))

    try {
      let {
        user: {
          address,
          provider,
          connectorId,
          chainId,
          dashboardKeyPopupCallback
        },
      } = getState()
      // @ts-ignore
      const dashboardKeyCreated = await actionsAsyncUser.getDashboardKey(
        dispatch,
        chainId as number,
        address,
        provider,
        connectorId
      )
  
      if (!dashboardKeyCreated) {
        return alertError('Error with dashboard key sign')
      }
  
      dispatch(actionsUser.setDashboardKey(dashboardKeyCreated))

      if (dashboardKeyPopupCallback) dashboardKeyPopupCallback(dashboardKeyCreated)
      
      dispatch(actionsUser.setDashboardKeyPopup(false))

    } catch (err) {
      alertError('Check console for more info')
      console.error('Some error occured', err)
    }
    dispatch(actionsUser.setLoading(false))
  }
}

export default signDashboardKey
import { Dispatch } from 'redux'
import {
  UserActions
} from '../types'
import * as actionsUser from '../actions'

const resetDashboardKeyPopup = (

) => {
  return async (
    dispatch: Dispatch<UserActions>
  ) => {
    dispatch(actionsUser.setDashboardKeyPopup(false))
    dispatch(actionsUser.setDashboardKeyPopupCallback(null))
  }
}

export default resetDashboardKeyPopup

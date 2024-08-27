import { Dispatch } from 'redux'
import * as userActions from '../../actions'
import {
  UserActions,
} from '../../types'
import { IAppDispatch } from 'data/store'
import { dashboardKeyApi } from 'data/api'
import {
  alertError,
  defineCoinbaseInstance
} from 'helpers'
import retrieveDashboardKeyWithPass from './retrieve-dashboard-key-with-pass'
import createDashboardKeyWithPass from './create-dashboard-key-with-pass'
import retrieveDashboardKey from './retrieve-dashboard-key'
import createDashboardKey from './create-dashboard-key'
import {
  ERROR_DASHBOARD_KEY_REJECTED_CREATE,
  ERROR_DASHBOARD_KEY_REJECTED_RETRIEVE,
  defineError
} from './error-handling'


const getDashboardKey = async (
  dispatch: Dispatch<UserActions> & IAppDispatch,
  chain_id: number,
  address: string,
  provider: any,
  connectorId: string | null
) => {  
  dispatch(userActions.setLoading(true))

  try {
    const dashboardKeyData = await dashboardKeyApi.get()
    const { encrypted_key, sig_message, key_id } = dashboardKeyData.data
    const coinbaseInstance = defineCoinbaseInstance(connectorId)

    if (!encrypted_key) {
      // register
      
      let result
      if (coinbaseInstance === 'coinbase_smart_wallet') {
        result = await createDashboardKeyWithPass(
          sig_message,
          address
        )
      } else {
        result = await createDashboardKey(
          provider,
          sig_message,
          address,
          chain_id
        )
      }
      
      if (result) {
        const {
          dashboard_key,
          encrypted_dashboard_key
        } = result 
        if (encrypted_dashboard_key && dashboard_key) {
          const { data: { success } } = await dashboardKeyApi.create(
            encrypted_dashboard_key,
            key_id
          )
          if (success) {
            dispatch(userActions.setDashboardKey(dashboard_key))
            dispatch(userActions.setAuthorizationStep('authorized'))
            dispatch(userActions.setLoading(false))
            return dashboard_key
          }
        }
      } else {
        throw new Error(ERROR_DASHBOARD_KEY_REJECTED_CREATE)
      }
    } else {
      let decrypted_dashboard_key
      if (coinbaseInstance === 'coinbase_smart_wallet') {
        decrypted_dashboard_key = await retrieveDashboardKeyWithPass(
          encrypted_key,
          sig_message,
          address
        )
      } else {
        decrypted_dashboard_key = await retrieveDashboardKey(
          provider,
          encrypted_key,
          sig_message,
          address,
          chain_id
        )
      }


      if (decrypted_dashboard_key) {
        dispatch(userActions.setDashboardKey(decrypted_dashboard_key))
        dispatch(userActions.setAuthorizationStep('authorized'))
        dispatch(userActions.setLoading(false))
        return decrypted_dashboard_key

      } else {
        throw new Error(ERROR_DASHBOARD_KEY_REJECTED_RETRIEVE)
      }
    }
  } catch (err) {
    dispatch(userActions.setAuthorizationStep('login'))
    const errorText = defineError(err as Error)
    alertError(errorText)
    console.error({ err })
    dispatch(userActions.setLoading(false))
  }
}





export default getDashboardKey

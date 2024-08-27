import { Dispatch } from 'redux'
import * as userActions from '../../actions'
import {
  UserActions,
} from '../../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { RootState, IAppDispatch } from 'data/store'
import { authorizationApi, plausibleApi } from 'data/api'
import {
  defineNetworkName,
  alertError,
} from 'helpers'
import {
  initialization
} from '../index'
import {
  ERROR_DASHBOARD_AUTH_REJECTED,
  defineError
} from './error-handling'

const authorize = (
  message: string,
  timestamp: number
) => {
  // @ts-nocheck
  return async (
    dispatch: Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    const {
      user: {
        address,
        chainId,
        signer
      }
    } = getState()
    dispatch(userActions.setLoading(true))
    
    try {

      try {
        const sig = await signer.signMessage(String(message))
        await authorizationApi.authorize(
          message,
          timestamp,
          sig,
          address.toLowerCase(),
          chainId as number
        )
      } catch (err) {
        plausibleApi.invokeEvent({
          eventName: 'sign_in_signature_reject',
          data: {
            signature: 'login'
          }
        })
        throw new Error(ERROR_DASHBOARD_AUTH_REJECTED)
      }
      
      dispatch(userActions.setAuthorizationStep('authorized'))


      dispatch(initialization())

      plausibleApi.invokeEvent({
        eventName: 'sign_in_step2',
        data: {
          network: defineNetworkName(chainId),
          success: 'yes',
        }
      })

      dispatch(userActions.setLoading(false))


    } catch (err) {
      dispatch(userActions.setAuthorizationStep('login'))
      const errorText = defineError(err as Error)
      alertError(errorText)
      console.error({ err })
      plausibleApi.invokeEvent({
        eventName: 'sign_in_step2',
        data: {
          network: defineNetworkName(chainId),
          success: 'no',
          errorText
        }
      })
      dispatch(userActions.setLoading(false))
    }
  }
}

export default authorize

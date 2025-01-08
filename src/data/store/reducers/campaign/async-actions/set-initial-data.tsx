
import { Dispatch } from 'redux';
import * as actionsCampaign from '../actions'
import * as actionsUser from '../../user/actions'
import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { TNFTToken, TTokenType } from 'types'
import { IAppDispatch } from 'data/store'
import { Alchemy } from 'alchemy-sdk'
import { defineAlchemyNetwork, defineNetworkName, alertError } from 'helpers'
import { RootState } from 'data/store'
import { plausibleApi } from 'data/api'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'
const { REACT_APP_ALCHEMY_API_KEY } = process.env

function setInitialData(
  tokenStandard: TTokenType,
  title: string,
  isNewCampaign: boolean,
  callback?: () => void
) {
  // @ts-ignore
  return async (
    dispatch: Dispatch<CampaignActions> & Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    dispatch(actionsCampaign.setLoading(true))
    dispatch(actionsCampaign.setTokenStandard(tokenStandard))
    dispatch(actionsCampaign.setTitle(title))

    try {
      const { user: { chainId }, campaign: { tokenAddress } } = getState()
      if (!chainId) {
        return alertError('No chainId provided in state of user')
      }
      if (!tokenAddress) {
        return alertError('No tokenAddress provided in state of user')
      }

      plausibleApi.invokeEvent({
        eventName: 'camp_step1_passed',
        data: {
          network: defineNetworkName(chainId),
          token_type: tokenStandard
        }
      })

      if (callback) {
        callback()
      }
    } catch (err) {
      console.error({
        err
      })
    }
    dispatch(actionsCampaign.setLoading(false))
  }
}

export default setInitialData

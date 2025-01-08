import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'
import { CampaignActions } from '../types'
import { TClaimPattern } from 'types'
import { IAppDispatch, RootState } from 'data/store'
import { plausibleApi } from 'data/api'
import { defineNetworkName } from 'helpers'
import { contractSpecificOptions } from 'configs/contract-specific-options'

function applyClaimPattern(
  claimPattern: TClaimPattern,
  isNewCampaign: boolean,
  callback?: () => void
) {
  return async (
    dispatch: Dispatch<CampaignActions> & IAppDispatch,
    getState: () => RootState
  ) => {

    const { 
      user: {
        chainId
      },
      campaign: {
        tokenStandard,
        tokenAddress
      }
    } = getState()

    const contractSpecificOption = contractSpecificOptions[(tokenAddress as string).toLowerCase()]

    if (
      contractSpecificOption &&
      contractSpecificOption.pattern &&
      contractSpecificOption.pattern.chainId === chainId
    ) {
      dispatch(actionsCampaign.setClaimPattern(contractSpecificOption.pattern.type))
    } else {
      dispatch(actionsCampaign.setClaimPattern(claimPattern))
    }

    try {

      plausibleApi.invokeEvent({
        eventName: 'camp_step2_passed',
        data: {
          network: defineNetworkName(chainId),
          token_type: tokenStandard as string,
          claim_pattern: claimPattern
        }
      })

      if (callback) {
        callback()
      }
    } catch (err) {
      console.error({ err })
    }
  }
}

export default applyClaimPattern

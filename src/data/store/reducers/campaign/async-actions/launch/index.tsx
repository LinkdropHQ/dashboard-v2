import { Dispatch } from 'redux'
import * as actionsCampaign from '../../actions'
import launchClaimLinksCampaign from './launch-claim-links-campaign'
import { CampaignActions } from '../../types'
import { UserActions } from '../../../user/types'
import { RootState } from 'data/store'
import * as actionsUser from '../../../user/actions'
import { getTotalAmountERC20 } from 'helpers'
import { approveERC20V3 } from 'data/store/reducers/user/async-actions/approve'
import secure from 'data/store/reducers/user/async-actions/secure/index'

const launch = (
  campaignId: string,
  proxyContractAddress: string,
  actionCallback?: () => void
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {
    const {
      campaigns: {
        campaigns
      },
      campaign: {
        links,
        decimals
      },
      user: {
        dashboardKey
      }
    } = getState()

    const campaign = campaigns.find(campaign => campaign.campaign_id === campaignId)
    if (campaign) {
      const {
        distribution_method,
        token_standard,
        campaign_number
      } = campaign

      const callback = async () => {
        if (!decimals) {
          throw new Error('No decimals defined')
        }
        const totalAmount = getTotalAmountERC20(
          links,
          decimals
        )

        // approve
        try {
          dispatch(actionsCampaign.setLaunchStage('approve'))
          if (token_standard === 'ERC20') {
            // @ts-ignore
            await approveERC20V3(
              totalAmount,
              proxyContractAddress,
              dispatch,
              getState
            )
          }
        } catch (err) {
          alert('ERROR APPROVE')
          console.error({ err })
        }

        // secure
        try {
          dispatch(actionsCampaign.setLaunchStage('secure'))
          if (token_standard === 'ERC20') {
            // @ts-ignore
            await secure(
              totalAmount,
              proxyContractAddress,
              campaign_number,
              dispatch,
              getState
            )
          }
        } catch (err) {
          alert('ERROR SECURE')
          console.error({ err })
        }

        if (distribution_method === 'CLAIM_LINKS') {
          //
          await launchClaimLinksCampaign({
            campaign_id: campaignId,
            proxyContractAddress,
            distribution_method,
            token_standard,
            dispatch,
            getState
          })
        }
      }

      if (!dashboardKey) {
        //
        dispatch(actionsCampaign.setLoading(false))
        dispatch(actionsUser.setDashboardKeyPopup(true))
        dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
        dispatch(actionsCampaign.setLaunchStage('dashboard_key'))
        return 
      }
      
      await callback()
    }

  }
}

export default launch
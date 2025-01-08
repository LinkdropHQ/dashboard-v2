import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsCampaigns from '../../campaigns/actions'

import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'
import { CampaignActions } from '../types'
import { CampaignsActions } from '../../campaigns/types'

import campaign from 'components/common/campaign'
import { TDistributionMethod } from 'types'

const addClaimLinksMethod = ({
  campaignId,
  successCallback
}: {
  campaignId: string,
  successCallback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<CampaignActions> & Dispatch<CampaignsActions>,
    getState: () => RootState
  ) => {
    const {
      campaigns: {
        campaigns
      }
    } = getState()

    dispatch(actionsCampaign.setLoading(true))
    try {
      const result = await campaignsApi.addClaimLinksMethod(
        {
          campaign_id: campaignId
        }
      )

      if (result.data.success) {

        const campaignsUpdated = campaigns.map(campaign => {
          if (campaign.campaign_id === campaignId) {
            return {
              ...campaign,
              distribution_method: 'CLAIM_LINKS' as TDistributionMethod
            }
          }
          return campaign
        })

        dispatch(actionsCampaigns.updateCampaigns(campaignsUpdated))

        if (successCallback) {
          successCallback()
        } 
      }
    } catch (err) {
      dispatch(actionsCampaign.setLoading(false))
      console.error(err)
    }

    
    dispatch(actionsCampaign.setLoading(false))
  }
}

export default addClaimLinksMethod
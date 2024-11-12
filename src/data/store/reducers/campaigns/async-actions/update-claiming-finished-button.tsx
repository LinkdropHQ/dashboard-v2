import { Dispatch } from 'redux'
import * as actionsCampaigns from '../actions'
import { CampaignsActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'

const updateClaimingFinishedButton = (
  campaign_id: string | number,
  claiming_finished_button_title: string,
  claiming_finished_button_url: string,
  claiming_finished_auto_redirect: boolean,
  callback?: () => void
) => {
  return async (
    dispatch: Dispatch<CampaignsActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsCampaigns.setLoading(true))
    const {
      campaigns: {
        campaigns
      }
    } = getState()
    
    try {
      const result = await campaignsApi.update({
        campaign_id,
        claiming_finished_button_title,
        claiming_finished_button_url,
        claiming_finished_auto_redirect
      })

      if (result.data.success) {
        
        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              claiming_finished_button_title,
              claiming_finished_button_url,
              claiming_finished_auto_redirect
            }
          }
          return campaign
        })
        dispatch(actionsCampaigns.updateCampaigns(updatedCampaigns))
        callback && callback()

      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsCampaigns.setLoading(false))
  }
}

export default updateClaimingFinishedButton
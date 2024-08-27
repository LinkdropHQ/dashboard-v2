import { Dispatch } from 'redux'
import * as actionsCampaigns from '../actions'
import { CampaignsActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'

const updatePreferredWallet = (
  campaign_id: string | number,
  preferredWallet: string,
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
      const result = await campaignsApi.updatePreferredWallet(
        campaign_id,
        preferredWallet
      )

      if (result.data.success) {
        
        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              wallet: preferredWallet
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

export default updatePreferredWallet
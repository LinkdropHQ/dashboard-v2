import { Dispatch } from 'redux'
import * as actionsCampaigns from '../actions'
import { CampaignsActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'

const updateAvailableCountries = (
  campaign_id: string | number,
  available_countries: string[],
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
        available_countries
      })

      if (result.data.success) {
        
        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              available_countries
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

export default updateAvailableCountries
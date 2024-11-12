import { Dispatch } from 'redux'
import * as actionsCampaigns from '../actions'
import { CampaignsActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'

const updateAvailableCountriesOn = (
  campaign_id: string | number,
  available_countries_on: boolean
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
        available_countries_on
      })

      if (result.data.success) {
        
        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              available_countries_on
            }
          }
          return campaign
        })
        dispatch(actionsCampaigns.updateCampaigns(updatedCampaigns))
      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsCampaigns.setLoading(false))
  }
}

export default updateAvailableCountriesOn
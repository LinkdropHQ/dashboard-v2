import { campaignsApi } from "data/api"
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsCampaigns from '../../campaigns/actions'

import { CampaignActions } from '../types'
import { CampaignsActions } from '../../campaigns/types'
import { RootState } from 'data/store'
import {
  alertError,
} from 'helpers'

const updateCampaign = ({
  campaign_id,
  additional_wallets_on,
  preferred_wallet_on,
  wallet,
  claim_host,
  available_countries_on,
  claiming_finished_button_on,
  claim_host_on,
  multiple_claims_on,
  claiming_finished_button_url,
  claiming_finished_button_title,
  available_countries,
  actionCallback
}: {
  campaign_id: string,
  additional_wallets_on?: boolean
  preferred_wallet_on?: boolean
  wallet: string
  claim_host: string
  available_countries_on?: boolean
  claiming_finished_button_on?: boolean
  claim_host_on?: boolean
  multiple_claims_on?: boolean
  claiming_finished_button_url?: string
  claiming_finished_button_title?: string
  available_countries: string[]
  actionCallback?: (
    campaignId: string
  ) => void
}) => {
  return async (
    dispatch: Dispatch<CampaignActions | CampaignsActions >,
    getState: () => RootState
  ) => {


    dispatch(actionsCampaign.setLoading(true))

    const {
      campaigns: {
        campaigns
      }
    } = getState()

    try {
      

      const { data } = await campaignsApi.update({
        campaign_id: String(campaign_id),
        additional_wallets_on,
        preferred_wallet_on,
        wallet,
        claim_host,
        available_countries_on,
        claiming_finished_button_on,
        claim_host_on,
        multiple_claims_on,
        claiming_finished_button_url,
        claiming_finished_button_title,
        available_countries,
      })

      const campaignsUpdated = campaigns.map(campaign => {
        if (campaign.campaign_id === campaign_id) {
          return {
            ...campaign,
            additional_wallets_on,
            preferred_wallet_on,
            wallet,
            claim_host,
            available_countries_on,
            claiming_finished_button_on,
            claim_host_on: Boolean(claim_host_on),
            multiple_claims_on: Boolean(multiple_claims_on),
            claiming_finished_button_url,
            claiming_finished_button_title,
            available_countries,
          }
        }

        return campaign
      })

      dispatch(actionsCampaigns.updateCampaigns(campaignsUpdated))

      if (data.success) {
        if (actionCallback) {
          actionCallback(data.campaign.campaign_id)
        }
      }
      
    } catch (err) {
      console.error({
        err
      })
      alertError('Some error occured. Please check console for more info')
    }

    dispatch(actionsCampaign.setLoading(false))

  }
}

export default updateCampaign
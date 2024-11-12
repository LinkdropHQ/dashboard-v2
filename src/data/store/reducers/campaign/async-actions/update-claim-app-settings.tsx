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
  claiming_finished_button_on,
  claiming_finished_button_url,
  claiming_finished_button_title,
  actionCallback
}: {
  campaign_id: string,
  additional_wallets_on?: boolean
  preferred_wallet_on?: boolean
  wallet: string
  claiming_finished_button_on?: boolean
  claiming_finished_button_url?: string
  claiming_finished_button_title?: string
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
        claiming_finished_button_on,
        claiming_finished_button_url,
        claiming_finished_button_title
      })

      const campaignsUpdated = campaigns.map(campaign => {
        if (campaign.campaign_id === campaign_id) {
          return {
            ...campaign,
            additional_wallets_on,
            preferred_wallet_on,
            wallet,
            claiming_finished_button_on,
            claiming_finished_button_url,
            claiming_finished_button_title
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
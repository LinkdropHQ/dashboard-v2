import { campaignsApi } from "data/api"
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsCampaigns from 'data/store/reducers/campaigns/actions'
import { CampaignsActions } from 'data/store/reducers/campaigns/types'

import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import {
  alertError,
  createProxy
} from 'helpers'


const createCampaign = (
  title: string,
  actionCallback?: (
    campaignId: string
  ) => void
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {
    const {
      user: {
        sdk,
        address,
        chainId,
        signer
      },
      campaigns: {
        campaigns
      }
    } = getState()

    try {
      const campaignId = String(+(new Date()))
      const proxyContractAddress = await createProxy(
        chainId as number,
        address as string,
        campaignId,
        sdk
      )
  
      if (!proxyContractAddress) {
        throw new Error('proxyContractAddress is not defined')
      }



      const { data } = await campaignsApi.createV3({
        title,
        chain_id: String(chainId),
        campaign_number: campaignId,
        proxy_contract_address: proxyContractAddress,
        creator_address: address
      })

      if (data.success) {
        const campaignsUpdated = campaigns.concat([data.campaign, ...campaigns])
        dispatch(actionsCampaigns.updateCampaigns(campaignsUpdated))
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

export default createCampaign
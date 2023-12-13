
import { Dispatch } from 'redux';
import * as actionsCampaign from '../actions';
import { CampaignActions } from '../types';
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'

const createProxyContract = (id?: string) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {
    const { user: { sdk }, campaigns: { campaigns } } = getState()
    if (id) {
      const campaign = campaigns.find(campaign => campaign.campaign_number === id)
      if (campaign) {
        const { proxy_contract_address } = campaign
        dispatch(actionsCampaign.setProxyContractAddress(proxy_contract_address))
        dispatch(actionsCampaign.setId(id))
        return
      }
    }
    const campaignId = String(+(new Date()))
    const proxyContractAddress = await sdk?.getProxyAddress(campaignId)
    if (!proxyContractAddress) { return }
    dispatch(actionsCampaign.setProxyContractAddress(proxyContractAddress))
    dispatch(actionsCampaign.setId(campaignId))
  }
}

export default createProxyContract
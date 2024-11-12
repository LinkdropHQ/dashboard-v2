
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import {
  alertError,
  createProxy
} from 'helpers'

const createProxyContract = (id?: string) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {
    const {
      user: {
        sdk,
        address,
        chainId
      },
      campaigns: {
        campaigns
      }
    } = getState()
    if (!chainId) {
      return alertError('No chain id provided')
    }
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
    const proxyContractAddress = await createProxy(
      chainId as number,
      address as string,
      campaignId,
      sdk
    )
    if (!proxyContractAddress) { return }
    dispatch(actionsCampaign.setProxyContractAddress(proxyContractAddress))
    dispatch(actionsCampaign.setId(campaignId))
  }
}

export default createProxyContract
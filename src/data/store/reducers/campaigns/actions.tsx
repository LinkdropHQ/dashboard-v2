import { action } from 'typesafe-actions';
import { Constants } from './constants';
import { TCampaign } from 'types'

export function addCampaign(campaign: TCampaign) {
  return action(Constants.CAMPAIGNS_ADD_NEW_CAMPAIGN, campaign)
}

export function updateCampaigns(campaigns: TCampaign[]) {
  return action(Constants.CAMPAIGNS_UPDATE_CAMPAIGNS, campaigns)
}

export function setLoading(loading: boolean) {
  return action(Constants.CAMPAIGNS_SET_LOADING, loading)
}

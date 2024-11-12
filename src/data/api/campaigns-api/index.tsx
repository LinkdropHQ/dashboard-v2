import axios from 'axios'
import { TLink, TCampaignNew } from 'types'
import {
  TGetLimitsTGetOneCampaign,
  TCreateСampaign,
  TUpdateCampaign
} from './types'
const {
  REACT_APP_SERVER_URL,
  REACT_APP_ZUPLO_API_KEY
} = process.env

const campaignsApi = axios.create({
  baseURL: `${REACT_APP_SERVER_URL}/api/v2/dashboard`,
  headers: {
    Authorization: `Bearer ${REACT_APP_ZUPLO_API_KEY as string}`
  }
})

const requests: {
  getOne: TGetLimitsTGetOneCampaign,
  createV3: TCreateСampaign,

  // will update later
  create: any,
  get: any,
  update: TUpdateCampaign,
  saveBatch: any,
  getBatches: any,
  getReport: any,
  getBatch: any
} = {
  create: (
    campaign: TCampaignNew
  ) => campaignsApi.post('/linkdrop/campaigns', {
    ...campaign
  }, { withCredentials: true }),

  get: (chain_id: number | string) => {
    return campaignsApi.get(`/linkdrop/campaigns?chain_id=${chain_id}`, { withCredentials: true })
  },


  createV3: ({
    title,
    chain_id,
    campaign_number,
    proxy_contract_address,
    creator_address
  }) => {
    return campaignsApi.post(`/linkdrop/campaigns`, {
      title,
      chain_id,
      campaign_number,
      proxy_contract_address,
      creator_address
    }, {
      withCredentials: true
    })
  },


  update: ({
    campaign_id,
    multiple_claims_on,
    additional_wallets_on,
    archived,
    claim_host_on,
    claim_host,
    claiming_finished_button_title,
    claiming_finished_button_url,
    claiming_finished_button_on,
    wallet,
    available_countries,
    available_countries_on,
    preferred_wallet_on
  }) => {
    return campaignsApi.patch(`/linkdrop/campaigns/${campaign_id}`, {
      multiple_claims_on,
      additional_wallets_on,
      archived,
      claim_host_on,
      claim_host,
      claiming_finished_button_title,
      claiming_finished_button_url,
      claiming_finished_button_on,
      wallet,
      available_countries,
      available_countries_on,
      preferred_wallet_on
    }, {
      withCredentials: true
    })
  },

  getOne: (
    campaign_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}`, { withCredentials: true })
  },

  saveBatch: (
    campaign_id: string | number,
    claim_links: TLink[],
    batch_description: string
  ) => {
    return campaignsApi.post(
      `/linkdrop/campaigns/${campaign_id}/save-batch`,
      {
        claim_links,
        batch_description
      },
      { withCredentials: true }
    )
  },

  getBatches: (
    campaign_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}/batches`, { withCredentials: true })
  },

  getReport: (
    campaign_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}/report`, { withCredentials: true })
  },

  getBatch: (
    campaign_id: string | number,
    batch_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}/batches/${batch_id}`, { withCredentials: true })
  }
}

export default requests

import axios from 'axios'
import { TLink, TCampaignNew } from 'types'
import {
  TCreateСampaign,
  TGetOneCampaign,
  TUpdateCampaign,
  TSaveBatchV3,
  TAddClaimLinksMethod
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
  getOne: TGetOneCampaign,
  createV3: TCreateСampaign,
  update: TUpdateCampaign,
  saveBatchV3: TSaveBatchV3,
  addClaimLinksMethod: TAddClaimLinksMethod,
  // will update later
  create: any,
  get: any,
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
    creator_address,
    encrypted_signer_key,
    signer_address
  }) => {
    return campaignsApi.post(`/linkdrop/campaigns`, {
      title,
      chain_id,
      campaign_number,
      proxy_contract_address,
      creator_address,
      encrypted_signer_key,
      signer_address,
      proxy_contract_version: '1'
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

  addClaimLinksMethod: ({
    campaign_id
  }) => {
    return campaignsApi.post(`/linkdrop/campaigns/${campaign_id}/distribution-method`, {
      type: 'CLAIM_LINKS'
    }, { withCredentials: true })
  },

  getOne: (
    campaign_id
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}`, { withCredentials: true })
  },

  saveBatchV3: ({
    campaign_id,
    claim_links
  }) => {
    return campaignsApi.post(
      `/linkdrop/campaigns/${campaign_id}/save-batch`,
      {
        claim_links
      },
      { withCredentials: true }
    )
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

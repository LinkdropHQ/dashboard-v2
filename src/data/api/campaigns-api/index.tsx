import axios from 'axios'
import { TLink } from 'types'
import {
  TCreateСampaign,
  TGetOneCampaign,
  TUpdateCampaign,
  TSaveBatchV3,
  TAddClaimLinksMethod,
  TLaunchClaimLinks,
  TGetBatch
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
  launchClaimLinks: TLaunchClaimLinks,
  getBatch: TGetBatch,

  // will update later
  get: any,
  saveBatch: any,
  getBatches: any,
  getReport: any
} = {

  launchClaimLinks: ({
    campaign_id,
    claim_links,
    campaign,
    distribution_method
  }) => {
    return campaignsApi.post(`/linkdrop/campaigns/${campaign_id}/launch`, {
      claim_links,
      campaign,
      distribution_method
    }, { withCredentials: true })
  },
  get: (chain_id: number | string) => {
    return campaignsApi.get(`/linkdrop/campaigns?chain_id=${chain_id}`, { withCredentials: true })
  },


  createV3: ({
    title,
    chain_id,
    campaign_number,
    proxy_contract_address,
    creator_address,
  }) => {
    return campaignsApi.post(`/linkdrop/campaigns`, {
      title,
      chain_id,
      campaign_number,
      proxy_contract_address,
      creator_address,
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
      distribution_method: 'CLAIM_LINKS'
    }, { withCredentials: true })
  },

  getOne: (
    campaign_id
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}`, { withCredentials: true })
  },

  saveBatchV3: ({
    campaign_id,
    claim_links,
    token_address,
    token_standard
  }) => {
    return campaignsApi.post(
      `/linkdrop/campaigns/${campaign_id}/save-batch`,
      {
        claim_links,
        token_address,
        token_standard
      },
      { withCredentials: true }
    )
  },

  saveBatch: (
    campaign_id: string | number,
    claim_links: TLink[]
  ) => {
    return campaignsApi.post(
      `/linkdrop/campaigns/${campaign_id}/save-batch`,
      {
        claim_links
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
  },

  // launch: POST (`/linkdrop/campaigns/${campaign_id}/launch`, {
  //   distribution_method: ...,
  //   claim_links: []
  // })
}

export default requests

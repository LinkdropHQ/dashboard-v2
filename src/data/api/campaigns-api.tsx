import axios from 'axios'
import { TLink, TCampaignNew } from 'types'

const { REACT_APP_SERVER_URL } = process.env

const campaignsApi = axios.create({
  baseURL: REACT_APP_SERVER_URL
})

const requests = {
  create: (
    campaign: TCampaignNew
  ) => campaignsApi.post('/linkdrop/campaigns', {
    ...campaign
  }, { withCredentials: true }),
  get: (chain_id: number | string) => {
    return campaignsApi.get(`/linkdrop/campaigns?chain_id=${chain_id}`, { withCredentials: true })
  },
  getOne: (
    campaign_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}`, { withCredentials: true })
  },
  saveBatch: (
    campaign_id: string | number,
    claim_links: TLink[],
    sponsored: boolean,
    batch_description: string
  ) => {
    return campaignsApi.post(
      `/linkdrop/campaigns/${campaign_id}/save-batch`,
      {
        claim_links,
        sponsored,
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
  getBatch: (
    campaign_id: string | number,
    batch_id: string | number
  ) => {
    return campaignsApi.get(`/linkdrop/campaigns/${campaign_id}/batches/${batch_id}`, { withCredentials: true })
  }
}

export default requests

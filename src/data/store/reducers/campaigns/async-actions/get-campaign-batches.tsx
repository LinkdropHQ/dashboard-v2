import { Dispatch } from 'redux'
import * as actionsCampaigns from '../actions'
import { CampaignsActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'

const getCampaignBatches = ({
  campaign_id,
  callback
}: {
  campaign_id: string | number,
  callback: () => Promise<void>
}) => {
  return async (
    dispatch: Dispatch<CampaignsActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsCampaigns.setLoading(true))
    const {
      campaigns: {
        campaigns
      }
    } = getState()
    try {
      const result = await campaignsApi.getBatches(campaign_id)
      if (result.data.success) {
        let expirationDate: undefined | number
        const lastBatch = result.data.batches[0]
        if (lastBatch) {
          const batchData = await campaignsApi.getBatch(campaign_id, lastBatch.batch_id)
          if (batchData.data.success) {
            const { claim_links, batch } = batchData.data
            expirationDate = claim_links[0].expiration_time as number
          }
        }

        
        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              batches: result.data.batches,
              expiration_date: expirationDate
            }
          }
          return campaign
        })

        dispatch(actionsCampaigns.updateCampaigns(updatedCampaigns))

        callback && callback()
      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsCampaigns.setLoading(false))
  }
}

export default getCampaignBatches
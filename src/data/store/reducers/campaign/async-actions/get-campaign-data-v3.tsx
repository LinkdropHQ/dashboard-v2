import { Dispatch } from 'redux'
import * as actionsCampaigns from '../../campaigns/actions'
import { CampaignsActions } from '../../campaigns/types'
import * as actionsCampaign from '../actions'
import { CampaignActions } from '../types'
import { RootState } from 'data/store'
import { campaignsApi } from 'data/api'
import { TLink } from 'types'

const getCampaignBatches = ({
  campaign_id,
  callback
}: {
  campaign_id: string | number,
  callback: () => Promise<void>
}) => {
  return async (
    dispatch: Dispatch<CampaignsActions | CampaignActions>,
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
        const lastBatch = result.data.batches[0]
        if (lastBatch) {
          const batchData = await campaignsApi.getBatch(campaign_id, lastBatch.batch_id)
          if (batchData.data.success) {
            const { claim_links } = batchData.data
            const links: TLink[] = []
            claim_links.forEach(link => {
              links.push({
                token_amount: link.token_amount,
                wei_amount: link.wei_amount,
                _id: link._id,
                expiration_time: link.expiration_time
              })
            })
            dispatch(actionsCampaign.setLinks(links))
          }
        }

        const updatedCampaigns = campaigns.map(campaign => {
          if (campaign.campaign_id === campaign_id) {
            return {
              ...campaign,
              batches: result.data.batches
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
import { AxiosResponse } from 'axios'
import { TCampaign } from 'types'

type TGetOneCampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TGetOneCampaign = (
  campaign_id: string
) => Promise<AxiosResponse<TGetOneCampaignResponse>>

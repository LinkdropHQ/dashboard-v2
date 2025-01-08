import { AxiosResponse } from 'axios'
import { TDistributionMethod, TCampaign } from 'types'

type TAddClaimLinksMethodResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TAddClaimLinksMethod = (
  {
    campaign_id
  }: {
    campaign_id: string
  }
) => Promise<AxiosResponse<TAddClaimLinksMethodResponse>>

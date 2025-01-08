import { AxiosResponse } from 'axios'
import { TLink, TCampaignLaunch, TCampaign, TDistributionMethod } from 'types'

type TLaunchClaimLinksResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TLaunchClaimLinks = ({
  campaign_id,
  claim_links,
  campaign,
  distribution_method
}: {
  campaign_id: string | number,
  claim_links: TLink[],
  campaign: TCampaignLaunch,
  distribution_method: TDistributionMethod
}) => Promise<
  AxiosResponse<
    TLaunchClaimLinksResponse
  >
>

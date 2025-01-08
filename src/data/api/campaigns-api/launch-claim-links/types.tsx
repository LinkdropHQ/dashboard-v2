import { AxiosResponse } from 'axios'
import { TLink, TCampaignLaunch, TCampaign } from 'types'

type TLaunchClaimLinksResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TLaunchClaimLinks = ({
  campaign_id,
  claim_links,
  campaign
}: {
  campaign_id: string | number,
  claim_links: TLink[],
  campaign: TCampaignLaunch
}) => Promise<
  AxiosResponse<
    TLaunchClaimLinksResponse
  >
>

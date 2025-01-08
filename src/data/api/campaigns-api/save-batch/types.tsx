import { AxiosResponse } from 'axios'
import { TLink, TCampaign } from 'types'

type TSaveBatchV3Response = {
  success: boolean, 
  campaign: TCampaign
}

export type TSaveBatchV3 = ({
  campaign_id,
  claim_links
}: {
  campaign_id: string | number,
  claim_links: TLink[]
}) => Promise<
  AxiosResponse<
    TSaveBatchV3Response
  >
>

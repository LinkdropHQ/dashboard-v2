import { AxiosResponse } from 'axios'
import { TLink, TCampaign, TTokenType } from 'types'

type TSaveBatchV3Response = {
  success: boolean, 
  campaign: TCampaign
}

export type TSaveBatchV3 = ({
  campaign_id,
  claim_links,
  token_address,
  token_standard
}: {
  campaign_id: string | number,
  claim_links: TLink[],
  token_address: string,
  token_standard: TTokenType
}) => Promise<
  AxiosResponse<
    TSaveBatchV3Response
  >
>

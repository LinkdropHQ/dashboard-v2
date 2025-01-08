import { AxiosResponse } from 'axios'
import { TLink } from 'types'

type TGetBatchResponse = {
  success: boolean, 
  claim_links: TLink[]
}

export type TGetBatch = (
  campaign_id: string | number,
  batch_id: string | number
) => Promise<AxiosResponse<TGetBatchResponse>>

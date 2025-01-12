import { AxiosResponse } from 'axios'
import { TCampaign } from 'types'

type TGetAllResponse = {
  success: boolean, 
  campaigns_array: TCampaign[]
}

export type TGetAll = (
  chain_id: number | string
) => Promise<AxiosResponse<TGetAllResponse>>

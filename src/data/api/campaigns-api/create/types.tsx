import { AxiosResponse } from 'axios'
import { TCampaign } from 'types'

type TCreateСampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TCreateСampaign = ({
  title,
  chain_id,
  campaign_number,
  proxy_contract_address,
  creator_address,
  // encrypted_signer_key,
  // signer_address
}: {
  title: string,
  chain_id: string,
  campaign_number: string,
  proxy_contract_address: string,
  creator_address: string,
  // encrypted_signer_key: string,
  // signer_address: string
}) => Promise<AxiosResponse<TCreateСampaignResponse>>

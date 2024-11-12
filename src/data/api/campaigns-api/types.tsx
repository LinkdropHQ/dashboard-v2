import { AxiosResponse } from 'axios'
import { TCampaign } from 'types'

type TGetOneCampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TGetLimitsTGetOneCampaign = (
  campaign_id: string
) => Promise<AxiosResponse<TGetOneCampaignResponse>>


type TCreateСampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

type TUpdateСampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

export type TCreateСampaign = ({
  title,
  chain_id,
  campaign_number,
  proxy_contract_address,
  creator_address,
  encrypted_signer_key,
  signer_address,
  proxy_contract_version
}: {
  title: string,
  chain_id: string,
  campaign_number: string,
  proxy_contract_address: string,
  creator_address: string,
  encrypted_signer_key: string,
  signer_address: string,
  proxy_contract_version: string
}) => Promise<AxiosResponse<TCreateСampaignResponse>>


export type TUpdateCampaign = ({
  campaign_id,
  multiple_claims_on,
  additional_wallets_on,
  archived,
  claim_host_on,
  claim_host,
  claiming_finished_button_title,
  claiming_finished_button_url,
  claiming_finished_button_on,
  wallet,
  available_countries,
  available_countries_on,
  preferred_wallet_on
}: {
  campaign_id: string | number,
  multiple_claims_on?: boolean,
  additional_wallets_on?: boolean,
  archived?: boolean,
  claim_host_on?: boolean,
  claim_host?: string,
  claiming_finished_button_title?: string,
  claiming_finished_button_url?: string,
  claiming_finished_button_on?: boolean,
  wallet?: string,
  available_countries?: string[],
  available_countries_on?: boolean,
  preferred_wallet_on?: boolean
}) => Promise<AxiosResponse<TUpdateСampaignResponse>>
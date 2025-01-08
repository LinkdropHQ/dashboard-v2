
import { AxiosResponse } from 'axios'
import { TCampaign } from 'types'


type TUpdateСampaignResponse = {
  success: boolean, 
  campaign: TCampaign
}

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
import { TDistributionMethod, TTokenType } from './index.js'
import { TLink, TClaimPattern } from 'types'

type TCampaignNew = {
  // v3
  title: string
  chain_id: string
  campaign_number: string
  proxy_contract_address: string
  creator_address: string
  proxy_contract_version: string | number
  encrypted_signer_key: string
  signer_address: string


  token_address: string
  token_standard: TTokenType
  symbol: string
  wallet: string
  claim_links?: TLink[]
  sponsored?: boolean
  batch_description: string
  created_at?: string
  claim_pattern: TClaimPattern
  sdk: boolean
  available_countries: string[]
  available_countries_on: boolean
  preferred_wallet_on: boolean 
  collection_id?: null | string
  collection_token_id?: null | string

  claiming_finished_button_title?: string
  claiming_finished_button_url?: string
  claiming_finished_auto_redirect?: boolean

  additional_wallets_on: boolean
  claim_host: string
  claim_host_on: boolean
  multiple_claims_on: boolean

  // v3
  draft: boolean
  distribution_method: TDistributionMethod
}

export default TCampaignNew

import { TTokenType } from './index.js'
import {
  TLinksBatch,
  TClaimPattern,
  TDistributionMethod 
} from 'types'

type TCampaign = {
  title: string
  chain_id: number
  campaign_id: string
  campaign_number: string
  token_address: string
  token_standard: TTokenType
  symbol: string
  wallet: string
  proxy_contract_address: string
  encrypted_signer_key: string
  signer_address: string
  batches: TLinksBatch[]
  creator_address: string
  created_at?: string
  claim_pattern: TClaimPattern
  sdk: boolean
  links_count: number
  proxy_contract_version: string | number
  sponsored: boolean
  links_claimed: number
  available_countries: string[]
  expiration_date?: number
  claiming_finished_button_title?: string
  claiming_finished_button_url?: string
  claiming_finished_auto_redirect: boolean

  claiming_finished_button_on?: boolean
  available_countries_on?: boolean
  preferred_wallet_on?: boolean
  additional_wallets_on?: boolean

  token_id?: string
  collection_id?: string

  archived?: boolean
  claim_host: string
  claim_host_on: boolean
  multiple_claims_on: boolean


  // v3
  draft: boolean
  distribution_method: TDistributionMethod

}

export default TCampaign

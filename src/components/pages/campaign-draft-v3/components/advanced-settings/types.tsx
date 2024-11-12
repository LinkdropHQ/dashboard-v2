import {
  TCampaign
} from 'types'

export type TProps = {
  campaign: TCampaign
}

export type TSettingsData = {
  additional_wallets_on?: boolean
  preferred_wallet_on?: boolean
  wallet: string
  claim_host: string
  available_countries_on?: boolean
  claiming_finished_button_on?: boolean
  claim_host_on?: boolean
  multiple_claims_on?: boolean
  claiming_finished_button_url?: string
  claiming_finished_button_title?: string
  available_countries: string[]
}
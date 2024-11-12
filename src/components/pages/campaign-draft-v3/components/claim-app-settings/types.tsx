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
  claiming_finished_button_on?: boolean
  claiming_finished_button_url?: string
  claiming_finished_button_title?: string
}
import {
  TClaimPattern
} from 'types'

type TCampaignLaunch = {
  encrypted_signer_key: string
  signer_address: string
  symbol: string
  claim_pattern: TClaimPattern
  proxy_contract_version: string
}

export default TCampaignLaunch

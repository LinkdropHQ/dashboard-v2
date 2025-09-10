export type TDispenserStatus = 
  'READY' |
  'ACTIVE' |
  'FINISHED' |
  'NOT_UPLOADED' |
  'PAUSED' |
  'REDIRECT' |
  'ARCHIVED'

export type TDispenserLinks = {
  encrypted_claim_link?: string
  claim_link_id?: string
}[]

export type TDispenserWhitelistType = 'address' | 'email' | 'twitter'
export type TDispenserWhitelistItemAddress = {
  address: string
  dispenser_id: string
  type: TDispenserWhitelistType
}
export type TDispenser = {
  multiscan_qr_id: string
  dispenser_id?: string  
  links_count?: number
  
  claim_duration?: number
  // not used 

  claim_finish?: number | null
  
  claim_start?: number | null

  timeframe_on?: boolean

  created_at?: string
  updated_at?: string
  title: string
  dynamic?: boolean

  encrypted_multiscan_qr_enc_code: string
  decrypted_multiscan_qr_enc_code?: string

  encrypted_multiscan_qr_secret: string
  decrypted_multiscan_qr_secret?: string

  redirect_url?: string | null
  decrypted_redirect_url?: string

  active?: boolean
  redirect_on?: boolean

  dispenser_url?: string

  links_claimed?: number
  links_assigned?: number
  whitelist_type?: TDispenserWhitelistType
  whitelist?: TDispenserWhitelistItemAddress[]
  whitelist_count?: number
  whitelist_on?: boolean

  app_title?: string
  app_title_on?: boolean

  reclaim_app_id?: string | null
  reclaim_provider_id?: string | null
  reclaim_app_secret?: string | null
  reclaim?: boolean
}

export type TDispenserUpdateData = {
  claim_finish?: number | null
  claim_start?: number
  title?: string
  dispenser_id: string
}

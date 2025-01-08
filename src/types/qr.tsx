export type TQRStatus = 
  'NOT_SENT_TO_PRINTER' |
  'SENT_TO_PRINTER' |
  'ON_ITS_WAY_TO_WAREHOUSE' |
  'BEING_INSERTED_TO_BOXES' |
  'READY_TO_SHIP' |
  'SHIPPING' |
  'SHIPPED' |
  'ARCHIVED'

export type TQRItem = {
  qr_id: string
  encrypted_qr_secret: string
  encrypted_claim_link?: string
  claim_link_id?: string
}

export type TQRSet = {
  qr_quantity: number
  set_name?: string
  set_id?: number | string
  created_at?: string
  qr_array?: TQRItem[]
  links_uploaded?: boolean
  updated_at?: string
  status?: any
  creator_address?: string
  campaign?: any
}

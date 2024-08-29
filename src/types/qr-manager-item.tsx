import {
  TQRStatus
} from "./qr"

export type TQRManagerItemType = 'dispenser' | 'qr_set'

export type TQRManagerItem = {
  title: string
  item_id: string
  type: TQRManagerItemType
  created_at?: string
  links_assigned: number
  links_claimed: number
  links_count: number

  claim_duration?: number
  claim_start?: number
  claim_finish?: number | null
  active?: boolean
  redirect_on?: Boolean
  redirect_url?: string
  timeframe_on?: boolean
  updated_at?: string
  dynamic?: boolean
  status: TQRStatus
}
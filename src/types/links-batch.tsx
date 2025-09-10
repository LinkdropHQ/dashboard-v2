import { TLink } from './index'

type TLinksBatch = {
  claim_links: TLink[]
  batch_description: string
  created_at?: string
  batch_id: string
  claim_links_count: number
  links_claimed: number
  qr_campaign?: string
  qr_campaign_type?: 'QR_SET' | 'DISPENSER' | 'DYNAMIC_DISPENSER' | 'RECLAIM'
}

export default TLinksBatch

import { TLink } from './index'

type TLinksBatch = {
  claim_links: TLink[],
  sponsored?: boolean,
  batch_description: string,
  created_at?: string,
  claim_links_count: number,
  batch_id: string
}

export default TLinksBatch

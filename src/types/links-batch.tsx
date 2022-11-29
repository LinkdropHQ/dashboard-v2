import { TLink } from './index'

type TLinksBatch = {
  claim_links: TLink[],
  sponsored?: boolean,
  batch_description: string,
  created_at?: string
}

export default TLinksBatch

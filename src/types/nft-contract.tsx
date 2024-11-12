import { TTokenType } from './index.js'

type TNFTContract = {
  address: string
  name: string
  numDistinctTokensOwned: number
  symbol: string
  title: string
  tokenId: string
  tokenType: TTokenType
  totalBalance: number
  image: {
    thumbnailUrl: string
  }
}

export default TNFTContract

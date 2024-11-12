import TTokenType from "./token-type"

type TERC20Contract = {
  address: string
  totalBalance: string | null
  tokenType: TTokenType
  symbol: string
  decimals: number
  image: {
    thumbnailUrl: string
  }
}

export default TERC20Contract

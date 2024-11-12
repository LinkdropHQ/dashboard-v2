export type TERC20TokenOriginalItem = {
  symbol: string
  decimals: number
  address: string
  logoURI: string
}

export type TERC20TokenItem = {
  symbol: string
  decimals: number
  address: string
  image: {
    thumbnailUrl: string
  }
}

export type TERC20TokenList = Record<
  string, TERC20TokenItem
>

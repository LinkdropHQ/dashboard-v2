import { TTokenType } from './'

export type TContractListItem = {
  title: string
  type: TTokenType
  tokenAddress: string
  balance: string
  price?: string
  image?: string
}
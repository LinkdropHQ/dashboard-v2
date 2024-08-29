import TTokenType from "./token-type"

export type TCollectionToken = {
  name: string
  description?: string
  copies: string
  properties: Record<string, string>
  token_id: string
  thumbnail?: string
  campaign_id?: null | string
}

export type TCollection = {
  title: string
  collection_id?: string
  created_at?: string
  updated_at?: string
  symbol: string
  sbt: boolean
  token_standard: TTokenType
  token_address?: string
  tokens?: TCollectionToken[]
  tokens_amount?: string
  links_count?: number
  links_claimed?: number
  chain_id: String
}

export type TCollectionStatus = 
  'ADD_TOKENS' |
  'CREATE_LINKS' |
  'ACTIVE' |
  'LOADING'
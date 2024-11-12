import { FC } from 'react'
import {
  TokenList,
  TokenListItem,
  Token,
  TokenImage,
  TokenTitle,
  TokenBalance,
  TokenPrice,
  TokenContent
} from './styled-components'
import { 
  TProps,
  TTokenItem
} from './types'


export const TokenItem: FC<TTokenItem> = ({
  tokenAddress,
  title,
  price,
  balance,
  image,
  onSelect
}) => {
  return <Token onClick={() => {
    onSelect && onSelect(tokenAddress)
  }}>
    <TokenImage src={image} />
    <TokenContent>
      <TokenTitle>
        {title || 'No title'}
      </TokenTitle>
      <TokenBalance>
        {balance}
      </TokenBalance>
    </TokenContent>
    <TokenPrice>
      {price}
    </TokenPrice>
  </Token>
}

const TokensList: FC<TProps> = ({
  tokens,
  onSelect
}) => {
  return <TokenList>
    {tokens.map(token => {
      return <TokenListItem>
        <TokenItem {...token} onSelect={onSelect} />
      </TokenListItem>
    })}
  </TokenList>
}

export default TokensList
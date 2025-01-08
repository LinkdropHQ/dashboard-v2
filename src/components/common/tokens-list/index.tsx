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
  TSelectAction
} from './types'
import { TContractListItem } from "types"



export const TokenItem: FC<
  {
    contract: TContractListItem,
    onSelect: TSelectAction
  }
> = ({
  contract,
  onSelect
}) => {
  const {
    tokenAddress,
    title,
    price,
    balance,
    image
  } = contract
  return <Token onClick={() => {
    onSelect && onSelect(contract)
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
  contracts,
  onSelect
}) => {
  return <TokenList>
    {contracts.map(contract => {
      return <TokenListItem>
        <TokenItem
          contract={contract}
          onSelect={onSelect}
        />
      </TokenListItem>
    })}
  </TokenList>
}

export default TokensList
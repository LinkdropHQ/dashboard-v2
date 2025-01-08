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
    onSelect: TSelectAction,
    activeContract?: string
  }
> = ({
  contract,
  onSelect,
  activeContract
}) => {
  const {
    tokenAddress,
    title,
    price,
    balance,
    image
  } = contract
  return <Token
    active={activeContract === tokenAddress}
    onClick={() => {
      onSelect && onSelect(contract)
    }}
  >
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
  onSelect,
  activeContract,
  className
}) => {
  return <TokenList className={className}>
    {contracts.map(contract => {
      return <TokenListItem>
        <TokenItem
          contract={contract}
          onSelect={onSelect}
          activeContract={activeContract}
        />
      </TokenListItem>
    })}
  </TokenList>
}

export default TokensList
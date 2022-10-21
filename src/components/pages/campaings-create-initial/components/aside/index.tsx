import { FC } from 'react'
import {
  WidgetAside,
} from '../../styled-components'
import {
  WidgetText,
  WidgetNote,
  WidgetTextBlock
} from 'components/common'
import { defineNativeTokenSymbol, shortenString } from 'helpers'
import {
  TAside,
  TDefineTitle,
  TDefineTotalTitle
} from './types'
import {
  countAssetsTotalAmountERC20,
  countAssetsTotalAmountERC721,
  countAssetsTotalAmountERC1155
} from 'helpers'
import { TDefineAssetsTotalAmount } from 'types'

const renderText: TDefineTitle = (
  symbol,
  totalAmount,
  assets,
  nativeTokenSymbol
) => {
  if (!symbol) { return }
  

  if (symbol === nativeTokenSymbol) {
    return  <>
      <WidgetText>
        {defineTotalTitle(symbol, totalAmount, nativeTokenSymbol)}
      </WidgetText>
      <WidgetNote>
        {`${assets.length} links with ${symbol}`}
      </WidgetNote>
    </>
  }
  return <>
    <WidgetTextBlock>
      <WidgetText>
        {defineTotalTitle(symbol, totalAmount, nativeTokenSymbol)}
      </WidgetText>
    </WidgetTextBlock>
    <WidgetNote>
      Each link contains: {symbol}
    </WidgetNote>
  </>
}

const defineTotalTitle: TDefineTotalTitle = (
  symbol,
  totalAmount,
  nativeTokenSymbol
) => {
  if (totalAmount.original_amount && (!totalAmount.ids || totalAmount.ids.length === 0)) {
    const originalAmount = String(totalAmount.original_amount)
    const originalNativeTokensAmount = String(totalAmount.original_native_tokens_amount)
    if (
      originalAmount !== '0' &&
      originalNativeTokensAmount !== '0'
    ) {
      return `${originalAmount} ${symbol} + ${originalNativeTokensAmount} ${nativeTokenSymbol}`
    }

    if (
      originalAmount !== '0' &&
      originalNativeTokensAmount === '0'
    ) {
      return `${originalAmount} ${symbol}`
    }

    if (
      originalAmount === '0' &&
      originalNativeTokensAmount !== '0'
    ) {
      return `${originalNativeTokensAmount} ${nativeTokenSymbol}`
    }
  }
  if (totalAmount.ids && totalAmount.ids.length > 0) {
    
    
  }
  return ''
}

const countAssetsTotalAmount: TDefineAssetsTotalAmount = (assets, type) => {
  if (type.toUpperCase() === 'ERC20') {
    return countAssetsTotalAmountERC20(assets)
  } else if (type.toUpperCase() === 'ERC721') {
    return countAssetsTotalAmountERC721(assets)
  } else {
    return countAssetsTotalAmountERC1155(assets)
  }
}

const Aside: FC<TAside> = ({
  assets,
  symbol,
  type,
  chainId
}) => {
  if (!symbol || !chainId) {
    return <WidgetAside>
      <WidgetNote>Fill all fields to see the details</WidgetNote>
    </WidgetAside>
  }

  const nativeTokenSymbol = defineNativeTokenSymbol({
    chainId
  })
  
  const myAssets = countAssetsTotalAmount(assets, type)
  return <WidgetAside>
    <WidgetTextBlock>
      <WidgetText>Total: {assets.length} link(s)</WidgetText>
    </WidgetTextBlock>
    <WidgetTextBlock>
      {renderText(
        symbol,
        myAssets,
        assets,
        nativeTokenSymbol
      )}
    </WidgetTextBlock>
  </WidgetAside>
}

export default Aside
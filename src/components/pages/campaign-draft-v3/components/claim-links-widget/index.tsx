import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent,
  ErrorIcon
} from '../../styled-components'
import {
  WidgetDoneIndicator
} from 'components/common'
import {
  WidgetSubtitle
} from 'components/pages/common'
import {
  defineNativeTokenSymbol
} from 'helpers'
import { TProps } from './types'
import { TLink } from 'types'
import { BigNumberish, utils } from 'ethers'
import Icons from 'icons'

const defineTitle = (
  symbol?: string | null
) => {
  if (!symbol) {
    return 'Token'
  }
  return `Token: ${symbol?.toUpperCase()}`
}

const defineText = (
  links: TLink[],
  decimals: number | null,
  chainId: number,
  symbol?: string | null
) => {
  const linksAmount = links.length
  if (!symbol || linksAmount === 0) {
    return 'Select tokens, NFTs or SBTs from your wallet and add them to your drop.'
  }

  const {
    token_amount,
    wei_amount
  } = links[0]

  const tokenAmountFormatted = utils.formatUnits(
    token_amount as BigNumberish,
    decimals || 18
  )

  const weiAmountFormatted = utils.formatUnits(
    wei_amount as BigNumberish,
    18
  )

  const nativeTokenSymbol = defineNativeTokenSymbol({
    chainId
  })

  return `You have chosen ${tokenAmountFormatted} ${symbol} and an additional ${weiAmountFormatted} ${nativeTokenSymbol} in each of the ${linksAmount} claims`

}

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep,
  symbol,
  links,
  decimals,
  chainId,
  error
}) => {
  console.log({ links })
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
        {error && (!links || links.length === 0) ?
          <ErrorIcon>
            <Icons.RedWarningIcon />
          </ErrorIcon>  :
          <WidgetDoneIndicator done={!!(links)} /> 
        }
        {defineTitle(symbol)}
      </WidgetTitleStyled>
      <ButtonStyled
        appearance='action'
        size='small'
        onClick={() => setCurrentStep('choose_contract')}
      >
        Choose
      </ButtonStyled>
    </WidgetHeader>
    <WidgetContent>
      <WidgetSubtitle>
        {defineText(
          links,
          decimals,
          chainId,
          symbol
        )}
      </WidgetSubtitle>
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
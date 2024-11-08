import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from '../../styled-components'
import {
<<<<<<< HEAD
  WidgetDoneIndicator
} from 'components/common'
import {
  WidgetSubtitle
} from 'components/pages/common'
import { TProps } from './types'
import { TLink } from 'types'
import { BigNumberish, utils } from 'ethers'

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
  symbol?: string | null
) => {
  const linksAmount = links.length
  if (symbol || linksAmount === 0) {
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

  return `You have chosen ${tokenAmountFormatted}${symbol} and an additional 0.01 ETH in each of the ${linksAmount} claims`

}

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep,
  symbol,
  links,
  decimals,
  done
=======
  WidgetSubtitle
} from 'components/pages/common'
import { TProps } from './types'

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
}) => {
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
<<<<<<< HEAD
        <WidgetDoneIndicator done={!(links)} />
        {defineTitle(symbol)}
=======
        Token
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
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
<<<<<<< HEAD
        {defineText(
          links,
          decimals,
          symbol
        )}
=======
        Select tokens, NFTs or SBTs from your wallet and add them to your drop.
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
      </WidgetSubtitle>
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
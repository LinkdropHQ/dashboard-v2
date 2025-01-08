import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled
} from '../../styled-components'
import {
  WidgetSubtitle
} from 'components/pages/common'
import { TProps } from './types'

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep
}) => {
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
        Token
      </WidgetTitleStyled>
      <ButtonStyled
        appearance='action'
        size='small'
        onClick={() => setCurrentStep('choose_contract')}
      >
        Choose
      </ButtonStyled>
    </WidgetHeader>
    <WidgetSubtitle>
      Select tokens, NFTs or SBTs from your wallet and add them to your drop.
    </WidgetSubtitle>

  </WidgetStyled>
}

export default ClaimLinksWidget
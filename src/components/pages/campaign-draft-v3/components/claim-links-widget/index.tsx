import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
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
    <WidgetContent>
      <WidgetSubtitle>
        Select tokens, NFTs or SBTs from your wallet and add them to your drop.
      </WidgetSubtitle>
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
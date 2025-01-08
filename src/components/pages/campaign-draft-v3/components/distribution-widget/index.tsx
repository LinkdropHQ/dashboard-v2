import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from '../../styled-components'
import { TProps } from './types'

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep,
  distributionMethod
}) => {
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
        Distribution
      </WidgetTitleStyled>
      <ButtonStyled
        appearance='action'
        size='small'
        onClick={() => setCurrentStep('choose_distribution_method')}
      >
        Choose
      </ButtonStyled>
    </WidgetHeader>
    <WidgetContent>
      {distributionMethod}
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
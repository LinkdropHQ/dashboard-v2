import { FC } from 'react'
import { WidgetStyled } from '../../styled-components'
import { TProps } from './types'

const DistributionWidget: FC<TProps> = ({
  setCurrentStep
}) => {
  return <WidgetStyled>
    DISTRIBUTION WIDGET

    <button onClick={() => setCurrentStep('choose_distribution_method')}>CHOOSE</button>
  </WidgetStyled>
}

export default DistributionWidget
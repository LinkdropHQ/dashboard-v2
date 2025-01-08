import { FC } from 'react'
import { WidgetStyled } from '../../styled-components'
import { TProps } from './types'

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep
}) => {
  return <WidgetStyled>
    CLAIM LINKS

    <button onClick={() => setCurrentStep('choose_contract')}>CHOOSE</button>
  </WidgetStyled>
}

export default ClaimLinksWidget
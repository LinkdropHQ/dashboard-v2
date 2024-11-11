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
import { TProps } from './types'
import { TDistributionMethod } from 'types'
import Icons from 'icons'

const defineTitle = (
  distribution_method?: TDistributionMethod
) => {
  if (!distribution_method) {
    return 'Distribution'
  }
  return `Distribution: ${distribution_method}`
}

const defineText = (
  distribution_method?: TDistributionMethod
) => {
  switch (distribution_method) {
    case 'CLAIM_LINKS':
      return 'A set of single-claim QR codes. Each QR code is valid for one claim only, and becomes invalid after being scanned and claimed by a user.'
    default:
      return 'Let anyone claim your tokens or NFTs via sharable links or QR codes.'
  }
}

const defineNote = (
  distribution_method?: TDistributionMethod
) => {
  if (distribution_method === 'CLAIM_LINKS') {
    return null
  }
}

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep,
  distributionMethod,
  error
}) => {
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
        {error && !Boolean(distributionMethod) ?
          <ErrorIcon>
            <Icons.RedWarningIcon />
          </ErrorIcon> :
          <WidgetDoneIndicator done={Boolean(distributionMethod)} />
        }
        {defineTitle(
          distributionMethod
        )}
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
      <WidgetSubtitle>
        {defineText(
          distributionMethod
        )}
      </WidgetSubtitle>
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
import { FC } from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from '../../styled-components'
<<<<<<< HEAD
import {
  WidgetDoneIndicator
} from 'components/common'
import {
  WidgetSubtitle
} from 'components/pages/common'
import { TProps } from './types'
import { TDistributionMethod } from 'types'

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
=======
import { TProps } from './types'
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440

const ClaimLinksWidget: FC<TProps> = ({
  setCurrentStep,
  distributionMethod
}) => {
  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
<<<<<<< HEAD
        <WidgetDoneIndicator done={Boolean(distributionMethod)} />
        {defineTitle(
          distributionMethod
        )}
=======
        Distribution
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
      </WidgetTitleStyled>
      <ButtonStyled
        appearance='action'
        size='small'
        onClick={() => setCurrentStep('choose_distribution_method')}
      >
        Choose
      </ButtonStyled>
    </WidgetHeader>
<<<<<<< HEAD
    
    <WidgetContent>
      <WidgetSubtitle>
        {defineText(
          distributionMethod
        )}
      </WidgetSubtitle>
=======
    <WidgetContent>
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
      {distributionMethod}
    </WidgetContent>
  </WidgetStyled>
}

export default ClaimLinksWidget
import { FC, useState } from 'react'
import {
  TStep
} from './types'
import {
  Container,
  ButtonStyled
} from './styled-components'
import {
  ChooseContract
} from './components'

const definePopup = (
  currentStep: TStep | null,
  setCurrentStep: (currentStep: TStep | null) => void
) => {
  switch (
    currentStep
  ) {
    case null:
      return <ChooseContract
        onClose={() => setCurrentStep(null)}
      />
    default:
      return null
  }
}


const CampaignDraft: FC = () => {
  const [
    currentStep,
    setCurrentStep
  ] = useState<TStep | null>('choose_contract')

  return <Container>
    {
      definePopup(
        currentStep,
        setCurrentStep
      )
    }
  </Container>
}

export default CampaignDraft
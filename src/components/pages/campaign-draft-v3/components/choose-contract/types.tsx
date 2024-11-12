import {
  TStep
} from '../../types'

export type TProps = {
  onClose: () => void
  setCurrentStep: (currentStep: TStep | null) => void
}
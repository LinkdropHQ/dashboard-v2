import { TDistributionMethod } from 'types'
import { TStep } from '../../types'

export type TProps = {
  setCurrentStep: (currentStep: TStep | null) => void
  distributionMethod?: TDistributionMethod
}
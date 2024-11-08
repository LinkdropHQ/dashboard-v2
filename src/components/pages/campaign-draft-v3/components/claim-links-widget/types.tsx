import { TStep } from '../../types'
import { TLink } from 'types'

export type TProps = {
  setCurrentStep: (currentStep: TStep | null) => void
  symbol?: string | null
  links: TLink[]
  decimals: null | number
  done?: boolean
}
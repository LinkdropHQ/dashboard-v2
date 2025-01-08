import {
  FC
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'

const MultipleClaims: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  toggleAction,
  toggleValue
}) => {
  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleAction={toggleAction}
    toggleState={toggleValue}
  />
}

export default MultipleClaims
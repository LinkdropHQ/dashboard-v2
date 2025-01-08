import {
  FC,
  useState
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import { InputStyled } from './styled-components'
import { isURL } from 'helpers'

const CustomClaimHost: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  action,
  toggleAction,
  toggleValue,
  customClaimHost
}) => {
  const [ claimHostValue, setClaimHostValue ] = useState<string>(customClaimHost || '')

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleAction={toggleAction}
    toggleState={toggleValue}
    action={() => {
      if (claimHostValue) {
        if (!isURL(claimHostValue)) {
          return alert('Incorrect format for claim host')
        }
      }

      action(
        claimHostValue,
        () => onClose()
      )
    }}
  >
    {toggleValue && <>
      <InputStyled
        placeholder="https://"
        value={claimHostValue}
        onChange={(value) => {
          setClaimHostValue(value)
          return value
        }}
      />
    </>}
    

  </AsidePopup>
}

export default CustomClaimHost
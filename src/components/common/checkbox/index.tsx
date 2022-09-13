import { FC } from 'react'
import TCheckbox from './type'
import Icons from 'icons'
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxLabel,
  CheckboxMark,
  CheckboxContent,
  CustomCheckboxClassName
} from './styled-components'

const Checkbox: FC<TCheckbox> = ({
  label,
  onChange,
  value,
  disabled
}) => {
  return <CheckboxContainer disabled={disabled} onClick={() => {
    if (disabled) { return }
    onChange && onChange(!value)
  }}>
    <CheckboxContent>
      <CheckboxInput
        type='checkbox'
        checked={value}
      />
      <CheckboxMark className={CustomCheckboxClassName}>
        <Icons.CheckboxIcon />
      </CheckboxMark>
    </CheckboxContent>
    {label && <CheckboxLabel>
      {label}
    </CheckboxLabel>}
  </CheckboxContainer>
}

export default Checkbox
import styled from 'styled-components'
import { Button } from 'components/common'
import { Checkbox, Input } from 'linkdrop-ui'

export const CheckboxComponent = styled(Checkbox)`
  margin-bottom: 10px;
`

export const InputComponent = styled(Input)`
  margin-bottom: 10px;
`

export const PopupFormContent = styled.div`
  margin-bottom: 20px;
  padding-top: 20px;
`

export const PopupForm = styled.form`
`


export const Buttons = styled.div`
  display: flex;
  justify-content: end;

  & > button {
    margin-left: 16px;
  }
`

export const WidgetButton = styled(Button)`
`
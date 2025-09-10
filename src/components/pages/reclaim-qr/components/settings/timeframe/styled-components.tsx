import styled from 'styled-components'
import {
  DatePicker,
  Select,
  Input,
  Checkbox
} from 'linkdrop-ui'


export const InputComponent = styled(Input)`
`
export const DatePickerStyled = styled(DatePicker)`
`

export const SelectStyled = styled(Select)`
  max-width: 100px;
`

export const Note = styled.div`
  padding-top: 42px;
`

export const DateTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
  &:first-child {
    margin-bottom: 32px;
  }
  & > div {
    width: fit-content;
    margin-left: 12px;

    &:first-child {
      flex: 3;
      margin-left: 0px;
    }
  }
`

export const CheckboxStyled = styled(Checkbox)`

`
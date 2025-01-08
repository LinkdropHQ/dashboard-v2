import styled from 'styled-components'
import {
  Input,
  Select,
  Checkbox,
  Toggle,
  DatePicker
} from 'linkdrop-ui'
import { WidgetTitle } from 'components/pages/common'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const WidgetTitleStyled = styled(WidgetTitle)`
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`


export const CheckboxStyled = styled(Checkbox)`

`

export const WidgetSecure = styled.div`
  flex: 1;
  padding-right: 40px;
  border-right: 1px solid ${props => props.theme.primaryBorderColor};
`

export const StyledInput = styled(Input)`
  margin-bottom: 24px;
`



export const ToggleStyled = styled(Toggle)`

`

export const DatePickerStyled = styled(DatePicker)`
`

export const InputsContainer = styled.div`
`

export const SelectStyled = styled(Select)`
  width: 100%;
  margin-bottom: 32px
`


export const Note = styled.div`
  padding-top: 42px;
`

export const DateTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  &> div {
    width: fit-content;
    margin-left: 12px;

    &:first-child {
      flex: 3;
      margin-left: 0px;
    }
  }
`
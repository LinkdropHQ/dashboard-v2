import styled from "styled-components"
import {
  Select,
  Checkbox
} from 'linkdrop-ui'
import { AsidePopup } from 'components/common'

export const CheckboxStyled = styled(Checkbox)`

`
export const AsidePopupStyled = styled(AsidePopup)`
  display: grid;
  grid-template-rows: min-content min-content 1fr min-content;
  height: 100vh;
`

export const SelectStyled = styled(Select)`
  margin-bottom: 20px;
`
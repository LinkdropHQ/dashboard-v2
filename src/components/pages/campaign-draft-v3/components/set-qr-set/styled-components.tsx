import {
  Input,
  Toggle
} from "linkdrop-ui"
import styled from "styled-components"

export const InputStyled = styled(Input)`

`

export const ToggleStyled = styled(Toggle)`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 12px;

  h4 {
    margin: 0;
  }
`
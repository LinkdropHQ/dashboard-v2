import styled from "styled-components"
import {
  Aside,
} from 'components/pages/common'

export const AsideStyled = styled(Aside)`
  margin: 0;
  min-width: auto;
`

export const AsideContent = styled.div`
  margin-bottom: 32px;
`

export const Divider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.primaryBorderColor};
  width: 100%;
  margin: 6px 0;
`
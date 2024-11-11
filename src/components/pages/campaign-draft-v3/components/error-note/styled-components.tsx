import { Note } from "linkdrop-ui"
import { Widget } from 'components/common'
import styled from "styled-components"

export const Title = styled.h4`
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 12px;
`

export const List = styled.ul`
  margin: 0;
  padding-left: 16px;
`

export const ListItem = styled.li`
  margin: 0 0 4px;
  font-size: 16px;
  line-height: 24px;
`

export const WidgetStyled = styled(Widget)`
  background: ${props => props.theme.tagErrorBackgroundColor};
`



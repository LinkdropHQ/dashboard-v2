import { Widget } from 'components/common'
import { WidgetTitle } from 'components/pages/common'
import { Button } from "linkdrop-ui"

import styled from "styled-components"

export const WidgetStyled = styled(Widget)`

`

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const WidgetTitleStyled = styled(WidgetTitle)`
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`
export const WidgetContent = styled.div`
  margin-top: 16px;

`

export const ButtonStyled = styled(Button)``

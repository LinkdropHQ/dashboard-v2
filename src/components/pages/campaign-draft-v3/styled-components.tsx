import { Button } from "linkdrop-ui"
import { Widget } from 'components/common'
import styled from "styled-components"
import { WidgetTitle } from 'components/pages/common'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 356px;
  gap: 26px;
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`



export const ButtonStyled = styled(Button)`

`

export const ButtonStyledFullWidth = styled(Button)`
  width: 100%;
`


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
  display: flex;
  align-items: center;
`

export const WidgetContent = styled.div`
  padding-top: 16px;
`
export const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: end;
`
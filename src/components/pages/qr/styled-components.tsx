import { Widget, Button, Input } from "components/common"
import styled from "styled-components"

export const Container = styled.div`
  position: relative;
`

export const WidgetComponent = styled(Widget)``

export const WidgetInfo = styled.div`
  display: grid;
  max-width: 600px;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  align-items: center;
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const WidgetSubtitle = styled.h4`
  margin: 0;
  text-align: right;
  font-size: 16px;
`

export const WidgetValue = styled.div``

export const Buttons = styled.div`
  display: flex;
`

export const WidgetButton = styled(Button)`
  margin-right: 10px;
`

export const InputComponent = styled(Input)`
  margin-bottom: 10px;
`

export const PopupFormContent = styled.div`
  margin-bottom: 20px;
`

export const PopupForm = styled.form`
`

export const LinksIndicator = styled.div`
  
`
import styled from 'styled-components'
import { Button } from 'components/common'
import {
  WidgetComponent
} from 'components/pages/common'
import {
  CopyContainer,
  Input
} from 'linkdrop-ui'

export const WidgetValue = styled.div`
  font-weight: 600;
  font-size: 32px;
`

export const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`

export const WidgetButton = styled(Button)`
  width: 100%;
`


export const WidgetComponentStyled = styled(WidgetComponent)`
  max-width: 546px;
`

export const CopyContainerStyled = styled(CopyContainer)`
  margin-bottom: 32px;
  max-width: 100%;
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

export const Counter = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
`

export const SecondaryTextSpan = styled.span`
  color: ${props => props.theme.additionalTextColor};
`

export const MainContent = styled.div`
  margin-right: 24px;
  flex: 1 0 50%;
  position: relative;
`

export const QRImage = styled.img`
  max-width: 240px;
  margin: 0 auto 32px;
  display: block;
`

export const Text = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.primaryTextColor};
  margin: 0 0 32px;
`

export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, .3);
  display: flex;
  align-items: center;
  justify-content: center;
`
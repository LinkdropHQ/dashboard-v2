import styled from 'styled-components'
import { Button } from 'components/common'
import { Popup } from 'linkdrop-ui'

export const ButtonStyled = styled(Button)`

`

export const PopupStyled = styled(Popup)`
  max-width: 375px;
`

export const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
`

export const PopupContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

export const PopupText = styled.p`
  margin: 0 0 40px;
  text-align: center;
`

export const PopupImage = styled.img`
  margin: 0 0 32px;
  max-width: 48px;
`

export const PopupTitle = styled.h4`
  margin: 0 0 32px;
  font-weight: 600;
  font-size: 22px;
  line-height: 28px;
  text-align: center;
`
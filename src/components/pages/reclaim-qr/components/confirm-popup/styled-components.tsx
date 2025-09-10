import { Button } from 'components/common'
import styled from "styled-components"
import { Note } from 'linkdrop-ui'

export const PopupFormContent = styled.div`
  margin-bottom: 20px;
  padding-top: 20px;
`

export const PopupForm = styled.form`
`

export const Buttons = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  padding-top: 32px;
`

export const WidgetButton = styled(Button)`
  width: 50%;
`

export const PopupContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const PopupTitle = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  margin: 16px 0 0px;
`

export const PopupText = styled.p`
  font-size: 16px;
  margin: 0 0 16px;
  text-align: center;
`

export const NoteStyled = styled(Note)`
  padding: 16px;
  white-space: nowrap;
  margin-bottom: 16px;
  overflow: hidden;
  max-width: 460px;
  width: 100%;
  text-overflow: ellipsis;
  svg {
    display: none;
  }
`
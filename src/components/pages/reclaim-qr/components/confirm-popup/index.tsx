import { FC, useState } from 'react'
import { Popup } from 'linkdrop-ui'
import { TProps } from './types'
import {
  Buttons,
  PopupForm,
  WidgetButton,
  PopupContent,
  PopupFormContent,
  PopupTitle,
  PopupText,
  NoteStyled
} from './styled-components'
import Icons from 'icons'

const ConfirmPopup: FC<TProps> = ({
  onClose,
  onSubmit,
  loading,
  claimUrl,
  newRedirectURL
}) => {
  return <Popup
    onClose={() => {
      onClose()
    }}
  >
    <PopupContent>
      <Icons.PopupWarningIcon />
      <PopupTitle>Confirm action</PopupTitle>
      <PopupForm onSubmit={(evt) => {
        evt.preventDefault()
        onSubmit()
      }}>
        <PopupFormContent>
          <PopupText>Please note, that existing dispenser link:</PopupText>
          <NoteStyled>
            {claimUrl}
          </NoteStyled>
          <PopupText>will redirect to the new one:</PopupText>
          <NoteStyled>
            {newRedirectURL}
          </NoteStyled>
        </PopupFormContent>

        <Buttons>
          <WidgetButton
            title='Cancel'
            onClick={() => {
              onClose()
            }}
          />

          <WidgetButton
            title='Confirm'
            type='submit'
            loading={loading}
            appearance='action'
          />

        </Buttons>
      </PopupForm>
    </PopupContent>
    
  </Popup>
}

export default ConfirmPopup

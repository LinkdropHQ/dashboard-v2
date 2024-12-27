import { FC, useState } from 'react'
import { Popup } from 'linkdrop-ui'
import { TProps } from './types'
import {
  PopupForm,
  WidgetButton,
  PopupFormContent,
  Buttons,
  CheckboxComponent
} from './styled-components'

const DownloadPopup: FC<TProps> = ({
  onClose,
  onSubmit
}) => {
  const [ ssr, setSsr ] = useState<boolean>(false)
  
  return <Popup
    title='Download Settings'
    onClose={() => {
      onClose()
    }}
  >
    <PopupForm onSubmit={(evt) => {
      evt.preventDefault()
    }}>
      <PopupFormContent>
        <CheckboxComponent
          label='Enable SSR Claim App (BETA)'
          value={ssr}
          onChange={(value) => {
            setSsr(value)
          }}
        />
      </PopupFormContent>
      <Buttons>
        <WidgetButton
          onClick={() => {
            onSubmit(
              ssr
            )
          }}
          title='Download'
        />
      </Buttons>
      
    </PopupForm>
  </Popup>
}

export default DownloadPopup

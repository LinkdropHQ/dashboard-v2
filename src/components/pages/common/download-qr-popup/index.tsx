import { FC, useState } from 'react'
import { Popup } from 'linkdrop-ui'
import { TProps } from './types'
import {
  InputComponent,
  PopupForm,
  WidgetButton,
  PopupFormContent,
  Buttons,
  CheckboxComponent
} from './styled-components'
import { alertError } from 'helpers'

const DPI = 300

const convertInchesToPixels = (value: string) => {
  if (!value) { return alertError('Value is not valid') }
  if (isNaN(Number(value))) { return alertError('Value is not valid') }
  return Number(value) * DPI
}

const DownloadPopup: FC<TProps> = ({
  onClose,
  onSubmit
}) => {
  const [ formSize, setFormSize ] = useState('2')
  const [ ssr, setSSR ] = useState(false)

  const showError = Number(formSize) > 5
  
  return <Popup
    title='Specify the size of the QR code'
    onClose={() => {
      onClose()
    }}
  >
    <PopupForm onSubmit={(evt) => {
      evt.preventDefault()
    }}>
      <PopupFormContent>
        <InputComponent
          title='Width and width (inches)'
          value={String(formSize)}
          onChange={value => {
            if (/^[0-9.]+$/.test(value) || value === '') {
              setFormSize(value)
            }
            return value
          }}
          error={showError ? 'Maximum size is limited by 5 inches' : undefined}
          note={showError ? undefined : 'Maximum size is limited by 5 inches'}
        />
        <CheckboxComponent
          label='Enable SSR Claim App (BETA)'
          value={ssr}
          onChange={(value) => {
            setSSR(value)
          }}
        />
      </PopupFormContent>
      <Buttons>
        <WidgetButton
          disabled={!formSize}
          onClick={() => {
            const currentSize = convertInchesToPixels(formSize)
            if (currentSize) {
              onSubmit(currentSize, ssr)
            }
          }}
          title='Download'
        />
      </Buttons>
      
    </PopupForm>
  </Popup>
}

export default DownloadPopup

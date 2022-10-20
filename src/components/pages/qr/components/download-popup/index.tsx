import { FC, useState } from 'react'
import { Popup } from 'components/common'
import { TProps } from './types'
import { InputComponent, PopupForm, WidgetButton, PopupFormContent } from '../../styled-components'
import { useHistory } from 'react-router-dom'

const DPI = 300

const convertInchesToPixels = (value: string) => {
  if (!value) { return alert('Value is not valid') }
  if (isNaN(Number(value))) { return alert('Value is not valid') }
  return Number(value) * DPI
}

const DownloadPopup: FC<TProps> = ({
  onClose,
  id
}) => {
  const history = useHistory()
  const [ formSize, setFormSize ] = useState('2')
  
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
          title='Width (inches)'
          value={String(formSize)}
          onChange={value => { setFormSize(value); return value }}
          placeholder='Width (inches)'
        />
        <InputComponent
          title='Height (inches)'
          value={String(formSize)}
          onChange={value => { setFormSize(value); return value }}
          placeholder='Height (inches)'
        />
      </PopupFormContent>
      <WidgetButton
        disabled={!formSize}
        onClick={() => {
          const currentSize = convertInchesToPixels(formSize)
          if (currentSize) {
            history.push(`/qrs/${id}/download?width=${encodeURIComponent(currentSize)}&height=${encodeURIComponent(currentSize)}`)
          }
        }}
        title='Download'
      />
    </PopupForm>
  </Popup>
}

export default DownloadPopup

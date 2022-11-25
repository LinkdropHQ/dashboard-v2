import { FC, useState } from 'react'
import { Popup } from 'components/common'
import { TProps } from './types'
import { InputComponent, StyledProgressBar, PopupForm, WidgetButton, PopupFormContent } from '../../styled-components'

const QuantityPopup: FC<TProps> = ({
  onClose,
  onSubmit,
  quantity,
  loader,
  loading
}) => {
  const [ formQuantity, setFormQuantity ] = useState(quantity || '0')
  console.log({ loader })
  return <Popup
    title='Change quantity of QRs needed'
    onClose={() => {
      onClose()
    }}
  >
    <PopupForm onSubmit={(evt) => {
      evt.preventDefault()
      onSubmit(formQuantity)
    }}>
      <PopupFormContent>
        <InputComponent
          value={String(formQuantity)}
          onChange={value => {
            if (/^[0-9]+$/.test(value) || value === '') {
              setFormQuantity(value)
            }
            return value
          }}
          placeholder='Quantity'
        />
      </PopupFormContent>

      {loading && <StyledProgressBar
        current={Math.ceil(loader * 100)}
        max={100}
      />}

      <WidgetButton
        disabled={loading}
        title='Change'
      />
    </PopupForm>
  </Popup>
}

export default QuantityPopup

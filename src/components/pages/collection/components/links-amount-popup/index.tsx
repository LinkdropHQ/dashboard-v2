import { FC, useState } from 'react'
import { Popup } from 'linkdrop-ui'
import { TProps } from './types'
import { ethers } from 'ethers5'
import {
  InputComponent,
  PopupForm,
  WidgetButton,
  PopupFormContent,
  Buttons,
  PopupText
} from './styled-components'

const defineError = (
  value: string,
  limit?: string 
) => {
  if (value === '') { return `Should be a number` }
  if (value === '0') { return `Cannot be less than 1` }
  if (limit && ethers.BigNumber.from(value).gt(ethers.BigNumber.from(limit))) {
    return `Should be a number between 1 and ${limit}`
  }
  return undefined
}

const LinksAmountPopup: FC<TProps> = ({
  onClose,
  onSubmit,
  initialValue = '100',
  limit
}) => {
  const [ amount, setAmount ] = useState(initialValue)
  const showError = defineError(amount, limit)

  return <Popup
    title='Claim links'
    onClose={() => {
      onClose()
    }}
  >
    <PopupForm onSubmit={(evt) => {
      evt.preventDefault()
    }}>
      <PopupFormContent>
        <PopupText>How many Claim Links do you want to create</PopupText>
        <InputComponent
          title='Quantity'
          value={String(amount)}
          onChange={value => {
            if (/^[0-9]+$/.test(value) || value === '') {
              setAmount(value)
            }
            return value
          }}
          placeholder='Amount'
          error={showError}
        />
      </PopupFormContent>
      <Buttons>
        <WidgetButton
          onClick={() => {
            onClose()
          }}
          title='Cancel'
        />
        <WidgetButton
          disabled={Boolean(showError)}
          appearance='action'
          onClick={() => {
            if (amount) {
              onSubmit(amount)
            }
          }}
          title='Create'
        />
      </Buttons>
      
    </PopupForm>
  </Popup>
}

export default LinksAmountPopup

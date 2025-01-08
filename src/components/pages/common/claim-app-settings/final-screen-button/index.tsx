import {
  FC,
  useState
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import {
  InputStyled,
  CheckboxStyled
} from './styled-components'
import { isURL } from 'helpers'

const FinalScreenButton: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  action,
  buttonHrefValue,
  buttonTitleValue,
  autoRedirectValue,
  toggleAction,
  toggleValue
}) => {
  const [ buttonHref, setButtonHref ] = useState<string>(buttonHrefValue || '')
  const [ buttonTitle, setButtonTitle ] = useState<string>(buttonTitleValue || '')
  const [ autoRedirect, setAutoRedirect ] = useState<boolean>(autoRedirectValue || false)

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleAction={toggleAction}
    toggleState={toggleValue}
    action={() => {
      if (!buttonHref) {
        return alert('Button link not provided')
      }

      if (!autoRedirect) {
        if (!buttonTitle) {
          return alert('Button title not provided')
        }
  
        if (!isURL(buttonHref)) {
          return alert('Incorrect format for button link')
        }
      } else {
        if (!isURL(buttonHref)) {
          return alert('Incorrect format for button link')
        }
      }



      action(
        buttonTitle,
        buttonHref,
        autoRedirect,
        () => onClose()
      )
    }}
  >
    {toggleValue && <>
      <InputStyled
        placeholder="Text on the button"
        value={buttonTitle}
        onChange={(value) => {
          setButtonTitle(value)
          return value
        }}
      />

      <InputStyled
        placeholder="https://"
        value={buttonHref}
        onChange={(value) => {
          setButtonHref(value)
          return value
        }}
      />

      <CheckboxStyled
        label='Enable auto-redirect after claim'
        value={autoRedirect}
        onChange={(value) => {
          setAutoRedirect(value)
          return value
        }}
      />
    </>}
    

  </AsidePopup>
}

export default FinalScreenButton
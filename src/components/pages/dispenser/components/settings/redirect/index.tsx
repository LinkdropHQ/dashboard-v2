import {
  FC,
  useState,
  useEffect
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import { InputStyled } from './styled-components'
import { isURL } from 'helpers'

const defineError = (currentRedirectUrl: string, claimUrl?: string | null) => {
  if (!claimUrl) { return }
  if (currentRedirectUrl === claimUrl) {
    return 'Cannot set current dispenser link as redirect link'
  }
  if (!currentRedirectUrl || currentRedirectUrl === '') {
    return 'Cannot be empty'
  }
  if (!isURL(currentRedirectUrl)) {
    return 'Should be a valid URL'
  }

  return undefined
}

const Redirect: FC<TProps> = ({
  title,
  subtitle,
  onClose,
  toggleAction,
  redirectUrl,
  claimUrl,
  toggleValue,
  action
}) => {
  const [
    currentRedirectUrl, setCurrentRedirectUrl
  ] = useState<string>(redirectUrl || '')

  useEffect(() => {
    if (!redirectUrl) {
      return 
    }
    if (redirectUrl === currentRedirectUrl) {
      return
    } else {
      setCurrentRedirectUrl(redirectUrl)
    }
  }, [ redirectUrl ])

  const error = defineError(currentRedirectUrl, claimUrl)

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    action={() => action(
      currentRedirectUrl,
      () => onClose()
    )}
    actionDisabled={Boolean(error)}
    toggleAction={(value) => {
      toggleAction && toggleAction(value)
    }}
    toggleState={toggleValue}
  >
    {toggleValue && <InputStyled
      value={currentRedirectUrl}
      placeholder='https://'
      error={error}
      onChange={value => {
        setCurrentRedirectUrl(value)
        return value
      }}
    />}
    
  </AsidePopup>
}

export default Redirect
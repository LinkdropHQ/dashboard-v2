import { FC } from 'react'
import {
  Container,
  Title,
  Subtitle,
  Content,
  Controls,
  Note,
  Overlay,
  ToggleStyled
} from './styled-components'
import { Button } from '..'
import { TProps } from './types'

const AsidePopup: FC<TProps> = ({
  title,
  subtitle,
  children,
  note,
  onClose,
  action,
  actionDisabled,
  className,
  actionTitle = 'OK',
  toggleAction,
  toggleState = false
}) => {
  return <Overlay onClick={(evt) => {
    if (evt.target === evt.currentTarget) {
      onClose()
    }
  }}>
    <Container className={className}>
      <Title>
        {title}
        {toggleAction && <ToggleStyled
          value={toggleState}
          onChange={() => toggleAction(!toggleState)}
        />}
      </Title>
      <Subtitle>{subtitle}</Subtitle>
      <Content className='aside-popup__content'>
        {children}
      </Content>
      {action && <Controls>
        {note && <Note>{note}</Note>}
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={actionDisabled} appearance='action' onClick={action}>{actionTitle}</Button>
      </Controls>}
    </Container>
  </Overlay>
  
}

export default AsidePopup

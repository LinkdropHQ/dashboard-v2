import { FC } from 'react'
import {
  PopupStyled,
  Title,
  Subtitle,
  Header,
  Content,
  LaunchStage,
  LaunchStageText,
  LaunchStages,
  LaunchStageStatus
} from './styled-components'
import {
  Loader
} from 'components/common'
import {
  TProps,
  TLaunchStep
} from './types'
import Icons from 'icons'

export const LaunchPopupItem: FC<TLaunchStep> = ({
  title,
  status
}) => {
  return <LaunchStage>
    <LaunchStageStatus status={status}>
      {status === 'current' && <Loader size='small' />}
      {status === 'done' && <Icons.CheckboxIcon />}
    </LaunchStageStatus>
    <LaunchStageText>
      {title}
    </LaunchStageText>
  </LaunchStage>
}

const LaunchPopup: FC<TProps> = ({
  onClose,
  children,
  title = 'Launching...',
  text
}) => {
  return <PopupStyled onClose={onClose}>
    <Header>
      <Title>{title}</Title>
      <Subtitle>{text}</Subtitle>
    </Header>

    <Content>
      <LaunchStages>
        {children}
      </LaunchStages>
    </Content>
  </PopupStyled>
}

export default LaunchPopup
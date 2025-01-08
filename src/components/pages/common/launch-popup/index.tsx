import { FC } from 'react'
import {
  MiniPopupStyled,
  Title,
  Subtitle,
  Header,
  Content,
  LaunchStage,
  LaunchStageText,
  LaunchStageStatus
} from './styled-components'
import {
  TProps,
  TLaunchStep
} from './types'

export const LaunchPopupItem: FC<TLaunchStep> = ({
  title,
  status
}) => {
  return <LaunchStage>
    <LaunchStageStatus status={status} />
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
  return <MiniPopupStyled onClose={onClose}>
    <Header>
      <Title>{title}</Title>
      <Subtitle>{text}</Subtitle>
    </Header>

    <Content>
      {children}
    </Content>
  </MiniPopupStyled>
}

export default LaunchPopup
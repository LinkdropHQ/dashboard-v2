import styled, { css } from "styled-components"
import {
  TLaunchStepStatus
} from './types'
import { Popup } from "linkdrop-ui"

export const PopupStyled = styled(Popup)`

`

export const Title = styled.h3`
`

export const Subtitle = styled.p`
`

export const Header = styled.header`
`

export const Content = styled.div``

export const LaunchStages =  styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LaunchStage =  styled.li`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

export const LaunchStageStatus =  styled.div<{
  status: TLaunchStepStatus
}>`
  width: 20px;
  height: 20px;
  border-radius: 20px;

  ${props => props.status === 'done' && css`
    background-color: ${props.theme.primaryHighlightColor};
  `}

  ${props => props.status === 'disabled' && css`
    background-color: ${props.theme.disabledStageColor};
  `}

  ${props => props.status === 'current' && css`
    background-color: pink;
  `}
`

export const LaunchStageText =  styled.div`

`
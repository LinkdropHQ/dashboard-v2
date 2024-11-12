import styled, { css } from "styled-components"
import {
  TLaunchStepStatus
} from './types'
import { Popup } from "linkdrop-ui"

export const PopupStyled = styled(Popup)`

`

export const Title = styled.h3`
  margin: 0 0 12px;
`

export const Subtitle = styled.p`
  margin: 0;
`

export const Header = styled.header`
  padding: 0 0 32px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.primaryBorderColor};
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
  font-size: 14px;
  line-height: 20px;
`

export const LaunchStageStatus =  styled.div<{
  status: TLaunchStepStatus
}>`
  width: 20px;
  height: 20px;
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.status === 'done' && css`
    background-color: ${props.theme.primaryHighlightColor};
  `}

  ${props => props.status === 'disabled' && css`
    background-color: ${props.theme.disabledStageColor};
  `}

  ${props => props.status === 'current' && css`
    background-color: transparent;
  `}
`

export const LaunchStageText =  styled.div`

`
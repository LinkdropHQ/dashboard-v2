import styled from "styled-components"
import { MiniPopup } from "components/common"
import {
  TLaunchStepStatus
} from './types'

export const MiniPopupStyled = styled(MiniPopup)`

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


  background: pink;
`

export const LaunchStageText =  styled.div`
  width: 20px;
  height: 20px;
  border-radius: 20px;


  background: pink;
`
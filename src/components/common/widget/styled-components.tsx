import styled, { css } from 'styled-components'
import { TProps } from './types'

export const WidgetComponent = styled.div<TProps>`
  background: #FFF;
  width: 100%;
  border-radius: 16px;
  padding: 24px;
`

export const WidgetTitle = styled.h3`
  font-size: 22px;
  margin: 0 0 16px;
  font-weight: 600;
`

export const WidgetContent = styled.div`
  width: 100%;
`

export const WidgetText = styled.p`
  font-size: 16px;
  margin: 0 0 6px;
`

export const WidgetData = styled(WidgetText)`
  font-weight: 600;
`

export const WidgetNote = styled(WidgetText)`
  color: ${props => props.theme.additionalTextColor};
`

export const WidgetTextBlock = styled.div`
  margin-bottom: 20px;
`

export const WidgetDoneIndicator = styled.div<{
  done?: boolean
}>`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid ${props => props.theme.buttonDisabledBackgroundColor};

  ${props => props.done && css`
    border: none;
    background: ${props => props.theme.primaryHighlightColor};
  `}
`
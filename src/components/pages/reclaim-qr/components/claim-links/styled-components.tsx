import styled, { css } from 'styled-components'
import { Button } from 'components/common'
import {
  Aside
} from 'components/pages/common'


export const AsideStyled = styled(Aside)`
  max-width: 546px;
  min-width: 546px;
  margin: 0;
`

export const AsideContent = styled.div<{loading: boolean}>`
  margin-bottom: 32px;

  ${props => props.loading && css`
    min-height: 145px;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

export const AsideWidgetButton = styled(Button)`
  width: 100%;

  svg {
    margin-right: 4px;
  }
`

export const AsideSubtitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
`

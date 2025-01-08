import styled from 'styled-components'

import { Switcher } from 'linkdrop-ui'
import {
  TokensList,
  AsidePopup
} from 'components/common'

export const SwitcherStyled = styled(Switcher)`

`

export const TokensListStyled = styled(TokensList)`
  overflow-y: scroll;
`

export const AsidePopupStyled = styled(AsidePopup)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto;


  .aside-popup__content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    overflow: hidden;
  }
`

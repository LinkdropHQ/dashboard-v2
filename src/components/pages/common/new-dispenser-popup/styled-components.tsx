import styled from "styled-components"
import { AsidePopup } from 'components/common'
import { Link } from 'react-router-dom'

export const AsidePopupStyled = styled(AsidePopup)`
  display: grid;
  grid-template-rows: min-content min-content 1fr;
  height: 100vh;
  padding-bottom: 24px;

  .aside-popup__content {
    overflow-y: auto;
  }
`

export const Option = styled.div`
  display: grid;
  padding: 24px;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: center;
  cursor: pointer;
  border-radius: 16px;
  text-decoration: none;
  color: ${props => props.theme.primaryTextColor};
  transition: background-color .3s;

  &:hover {
    background-color: ${props => props.theme.menuItemActive};
  }
`

export const OptionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  display: grid;
  grid-template-columns: min-content 1fr min-content;
  gap: 8px;
  color: ${props => props.theme.primaryTextColor};
`

export const OptionText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.primaryTextColor};
  line-height: 20px;
`

export const OptionContent = styled.div`

`
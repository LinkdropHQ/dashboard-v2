import styled from "styled-components"
import { AsidePopup } from 'components/common'
import { Link } from 'react-router-dom'

export const AsidePopupStyled = styled(AsidePopup)`
  display: grid;
  grid-template-rows: min-content min-content 1fr min-content;
  height: 100vh;
  min-width: 614px;
`

export const Option = styled.div`
  display: grid;
  padding: 24px;
  grid-template-columns: 154px 1fr;
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
  display: flex;
  color: ${props => props.theme.primaryTextColor};
  justify-content: space-between;
`

export const OptionText = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.primaryTextColor};
  line-height: 20px;
`

export const OptionImage = styled.div`
  width: 100%;

  svg {
    max-width: 100%;
    height: auto;
  }
`

export const OptionContent = styled.div`

`
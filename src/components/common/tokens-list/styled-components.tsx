import styled from "styled-components"

export const TokenList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TokenListItem = styled.li`
  padding: 0;
  margin: 0;
`

export const Token = styled.article<{
  active: boolean
}>`
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 32px 1fr max-content;
  gap: 10px;
  align-items: center;

  &:hover {
    background: ${props => props.theme.menuItemActive};
  }

  ${props => props.active && `
    background: ${props.theme.menuItemActive};
  `}
`

export const TokenImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`

export const TokenTitle = styled.h4`
  margin: 0 0 2px;
  font-size: 16px;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 290px;
`

export const TokenBalance = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 26px;
`

export const TokenPrice = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 26px;
`
export const TokenContent = styled.div`
  
`
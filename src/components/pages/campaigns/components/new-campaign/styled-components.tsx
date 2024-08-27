import styled from "styled-components"

export const OptionsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 32px;
`

export const Option = styled.li`
  padding: 24px;
  margin: 0;
  cursor: pointer;
  border-radius: 16px;
  transition: background-color .3s;

  &:hover {
    background-color: ${props => props.theme.menuItemActive};
  }
`

export const OptionTitle = styled.h4`
  margin: 0 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  font-weight: 600;
  font-size: 22px;
  line-height: 28px;
`

export const OptionImage = styled.img`
  display: block;
  max-width: 64px;
  margin-bottom: 32px;
`

export const OptionText = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin: 0;
`




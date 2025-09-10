import { Widget } from "components/common"
import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`

export const Block = styled.div`
  min-height: 98px;
  background-color: ${props => props.theme.primaryBackgroundColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  justify-content: center;
`

export const BlockTitle = styled.h4`
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 8px;
  font-weight: 400;
`

export const BlockValue = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  margin: 0;
`
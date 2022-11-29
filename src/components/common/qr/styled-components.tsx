import styled from "styled-components";
import { Button } from 'components/common'

export const QRItem = styled.div`
  display: grid;
  align-items: center;
  border: 1px solid ${props => props.theme.primaryBorderColor};
  grid-template-columns: 2fr 1fr 2fr 1fr;
  padding: 20px;
  border-radius: 8px;
  background: ${props => props.theme.backgroundColor};
`

export const QRItemTitle = styled.h3`
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 20px;
`

export const QRItemAmount = styled.p`
  margin: 0;

  span {
    font-weight: 700;
  }
`

export const QRItemStatus = styled.p`
  margin: 0;
`

export const QRItemControls = styled.div`
  display: flex;
  justify-content: end;
`

export const QRItemButton = styled(Button)`
  padding: 10px 20px;
`
import { Button } from "components/common"
import { TableValue, TableText } from "components/pages/common"
import styled from "styled-components"

export const TableValueStyled = styled(TableValue)`
  display: flex;
  gap: 14px;
  align-items: center;
  cursor: pointer;
`

export const ButtonStyled = styled(Button)`
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
`

export const TableTextStyled = styled(TableText)`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    display: block;
  }
`

export const Container = styled.div`
  margin-bottom: 20px;
`
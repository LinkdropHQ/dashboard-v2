import styled from "styled-components"
import {
  Input
} from 'linkdrop-ui'
import { Button } from 'components/common'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 740px;
`

export const ContainerButton = styled(Button)`
  align-self: end;
  margin-right: 20px;

  &:last-child {
    margin-right: 0px;
  }
`

export const InputComponent = styled(Input)`
`

export const Buttons = styled.div`
  display: flex;
  justify-content: end;

  & > button {
    margin-left: 16px;
  }
`

export const Note = styled.div`
  padding-top: 42px;
`

import styled from "styled-components";
import {
  QR,
  Button,
  Input,
  ProgressBar
} from 'components/common' 

export const QRItem = styled(QR)`
  margin-bottom: 10px;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const ContainerButton = styled(Button)`
  align-self: end;
  margin-bottom: 20px;
`

export const InputComponent = styled(Input)`

`

export const GenerateProgressBar = styled(ProgressBar)`
  min-width: 100%;
  margin-bottom: 20px;
`
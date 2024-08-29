import { Toggle } from "linkdrop-ui"
import styled from "styled-components"

export const Container = styled.div`  
  padding: 24px 24px calc(56px + 24px + 12px);
  top: 0;
  right: 0;
  bottom: 0;
  width: 412px;
  position: absolute;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  background-color: ${props => props.theme.primaryBackgroundColor};
`

export const Overlay = styled.div`
  position: fixed;
  z-index: 2;
  right: 0;
  background: rgba(0, 0, 0, .3);
  top: 0;
  height: 100vh;
  width: 100%;
`

export const Title = styled.h3`
  font-size: 22px;
  line-height: 28px;
  margin: 0 0 12px;
  font-weight: 500;
  display: grid;
  align-self: center;
  grid-template-columns: max-content 1fr;
`

export const ToggleStyled = styled(Toggle)`
  justify-self: end;
`

export const Subtitle = styled.p`
  font-size: 16px;
  line-height: 24px;
`

export const Controls = styled.div`
  display: grid;
  gap: 12px;
  position: absolute;
  grid-template-columns: 1fr 1fr;
  bottom: 24px;
  left: 24px;
  width: calc(100% - 24px * 2);
`

export const Content = styled.div``

export const Note = styled.p`
  grid-column: span 2;
`
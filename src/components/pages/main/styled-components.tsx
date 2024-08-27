import styled from 'styled-components'
import { Widget, Button  } from 'components/common'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 400px 400px;
  grid-gap: 30px;
`

export const ImageContainer = styled.img`
  margin-bottom: 32px;
  max-width: 280px;
`

export const Contents = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(2, min-content);
  gap: 32px;
`

export const InvertedWidget = styled(Widget)`
  background-color: ${props => props.theme.blankColor};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
`

export const WidgetDescription = styled.p`
  font-size: 16px;
  margin: 0 0 30px;
`

export const WidgetButton = styled(Button)`
  padding: 4px 30px;
  width: 100%;
  margin-bottom: 15px;
  max-width: 250px;
`

export const AlignBottomButton = styled(WidgetButton)`
  align-self: flex-end;
  margin-top: auto;
`

export const Title = styled.h3`
  font-size: 24px;
  margin: 0 0 24px;
  font-weight: 600;
  max-width: 350px;
  line-height: 32px;  
`

export const ContainerCentered = styled.div`
  display: flex;
  max-width: 373px;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  flex-direction: column;
  a {
    width: 100%;

    &:last-child {
      margin-bottom: 0px;
    }
  }
`
export const ConnectWalletContainer = styled.div`
  
`

export const Text = styled.p`
  font-size: 16px;
  margin: 0 0 32px;
  line-height: 24px;
  max-width: 330px;
`

export const List = styled.ol`
  font-size: 16px;
  margin: 0 0 24px;
  line-height: 24px;
  padding-left: 16px;
  text-align: left;
`

export const ListItem = styled.li`
  margin: 0 0 4px;
`

export const TextBold = styled.span`
  font-weight: 700;
`

export const AdditionalButton = styled.button`
  padding: 0;
  background: none;
  border-radius: 0px;
  border: none;
  color: ${props => props.theme.primaryHighlightColor};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  line-height: 20px;

  margin-top: 10px;
`
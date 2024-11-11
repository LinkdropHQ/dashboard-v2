import { FC } from 'react'
import {
  List,
  ListItem,
  WidgetStyled,
  Title
} from './styled-components'
import { TProps } from './types'

const ErrorNote: FC<TProps> = ({
  claimLinks,
  distributionMethod
}) => {
  return <WidgetStyled>
    <Title>Before you can launch, changes need to be made to your drop.</Title>
    <List>
      {claimLinks.length === 0 && <ListItem>
        Choose token, NFT or SBT you want to drop
      </ListItem>}

      {distributionMethod === null && <ListItem>
        Chose how you want tokens to be distributed
      </ListItem>}
    </List>
  </WidgetStyled>
}


export default ErrorNote
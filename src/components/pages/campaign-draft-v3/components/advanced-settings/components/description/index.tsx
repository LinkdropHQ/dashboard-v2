import { FC } from 'react'
import {
  Highlight,
  List,
  ListItem,
  Description,
  Text
} from './styled-components'

const DescriptionComponent = () => {
  return <Description>
    <Text>You can edit it after launching a drop, but for now:</Text>
    <List>
      <ListItem>Users from any country can access to your drop</ListItem>
      <ListItem>Users can access your drop at any time</ListItem>
      <ListItem>One wallet can claim your tokens only once</ListItem>
      <ListItem>By the default users access your tokens through Linkdrop domain name</ListItem>

    </List>
  </Description>
}

export default DescriptionComponent
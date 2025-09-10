import { FC } from 'react'
import {
  Container,
  Block,
  BlockTitle,
  BlockValue
} from './styled-components'
import { TProps } from './types'

const Statistics: FC<TProps> = ({
  dispenserStatus,
  linksCount,
  linksAssigned,
  linksClaimed,
  downloadReport
}) => {
  if (dispenserStatus === 'NOT_UPLOADED') {
    return null
  }
  return <Container>
    <Block>
      <BlockTitle>Links</BlockTitle>
      <BlockValue>{linksCount}</BlockValue>
    </Block>

    <Block>
      <BlockTitle>Clicks / Scans</BlockTitle>
      <BlockValue>{linksAssigned}</BlockValue>
    </Block>

    <Block>
      <BlockTitle>Claims</BlockTitle>
      <BlockValue>{linksClaimed}</BlockValue>
    </Block>
  </Container>
}

export default Statistics
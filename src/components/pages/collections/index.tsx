import { FC } from 'react'
import {
  Container,
  Header,
  WidgetTitleStyled,
  ContainerButton,
  CollectionsListLabelStyled,
  CollectionsListStyled,
  SecondaryTextSpan,
  TokenImageStyled,
  BatchListLabelTextAlignRight,
  BatchListValueJustifySelfEnd
} from './styled-components'
import {
  Button,
  Loader
} from 'components/common'
import {
  BatchListLabel,
  BatchListValue,
  WidgetComponent,
  InitialNote
} from 'components/pages/common'
import {
  formatDate,
  formatTime,
  defineCollectionStatusTag,
  defineCollectionStatus
} from 'helpers'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'

const mapStateToProps = ({
  campaigns: { campaigns },
  collections: { collections, loading },
  user: { address, chainId },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  collections,
  loading
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {}
}

// ignore to avoid IDE problem, should be solved soon
// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const Collections: FC<ReduxType> = ({
  collections,
  loading
}) => {

  if (loading && collections.length === 0) {
    return <Loader size='large' />
  }

  if (collections.length === 0) {
    return <InitialNote
      title='Create your first Soulbound'
      text="Your Soulbound collection will be displayed here once created"
      href='/collections/new/ERC1155/initial'
      buttontText='New NFT collection'
    />
  }

  return <Container>
    <WidgetComponent>
      <Header>
        <WidgetTitleStyled>My Soulbounds</WidgetTitleStyled>
        <ContainerButton
          title='+ Add'
          disabled={loading}
          size='extra-small'
          appearance='action'
          to='/collections/new/ERC1155/initial'
        />
      </Header>
      {collections.length > 0 && <CollectionsListStyled>
        <BatchListLabel>Created</BatchListLabel>
        <BatchListLabel>Name</BatchListLabel>
        <BatchListLabel>Symbol</BatchListLabel>
        <BatchListLabel>Links</BatchListLabel>
        <BatchListLabel>Claims</BatchListLabel>
        <BatchListLabel>Status</BatchListLabel>
        <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>

        {/* @ts-ignore */}
        {collections.map(collection => {
          const {
            title,
            collection_id,
            created_at,
            tokens_amount,
            token_address,
            thumbnail,
            symbol,
            links_claimed,
            links_count
          } = collection
          const status = defineCollectionStatus(
            false,
            Number(links_count),
            Number(tokens_amount)
          )
          const statusTag = defineCollectionStatusTag(status)
          const dateCreatedFormatted = formatDate(created_at || '')
          const timeCreatedFormatted = formatTime(created_at || '')
          return <>
            <BatchListValue>
              {dateCreatedFormatted}, <SecondaryTextSpan>{timeCreatedFormatted}</SecondaryTextSpan>
            </BatchListValue>
            <CollectionsListLabelStyled>
              <TokenImageStyled src={thumbnail} address={token_address} />
              {title}
            </CollectionsListLabelStyled>

            <BatchListValue>
              {symbol}
            </BatchListValue>
            <BatchListValue>
              {links_count}
            </BatchListValue>
            <BatchListValue>
              {links_claimed}
            </BatchListValue>
            <BatchListValue>
              {statusTag}
            </BatchListValue>
            <BatchListValueJustifySelfEnd>
              <Button
                appearance='additional'
                size='extra-small'
                title='Manage'
                to={`/collections/${collection_id}`}
              />
            </BatchListValueJustifySelfEnd>
          </>
        })}
      </CollectionsListStyled>}
      
    </WidgetComponent>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(Collections)

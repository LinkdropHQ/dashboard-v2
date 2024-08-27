import { FC, useEffect } from 'react'
import { RootState, IAppDispatch } from 'data/store'
import {
  WidgetSubtitle
} from 'components/pages/common'

import {
  MainContent,
  WidgetComponentStyled,
  TokensList,
  TokenItem,
  ContainerStyled,
  Header,
  LoaderStyled,
  WidgetTitleStyled,
  ContainerButton
} from './styled-components'
import {
  Redirect,
  useHistory,
  useParams
} from 'react-router-dom'
import {
  TCollection,
  TCollectionToken
} from 'types'
import {
  Token,
  CollectionDetails,
  Status
} from './components'
import { connect } from 'react-redux'
import {
  defineCollectionStatus
} from 'helpers'
import {
  getCollectionData
} from 'data/store/reducers/collections/async-actions'


const mapStateToProps = ({
  collections: { collections, loading },
  user: { address, chainId },
}: RootState) => ({
  address,
  chainId,
  collections,
  loading
})

const renderTokens = (
  loading: boolean,
  collection_id: string,
  tokens?: TCollectionToken[]
) => {
  if (loading) {
    return <WidgetSubtitle>
      <LoaderStyled />
    </WidgetSubtitle>
  }

  if (!tokens || tokens.length === 0) {
    return  null
  }

  return <TokensList>
    {tokens.map(token => <TokenItem>
      <Token
        collectionId={collection_id}
        campaignId={token.campaign_id}
        {...token}
      />
    </TokenItem>)}
  </TokensList>
}

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    getCollectionData: (
      collection_id: string
    ) => {
      return dispatch(getCollectionData(collection_id))
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const Collection: FC<ReduxType> = ({
  collections,
  loading,
  chainId,
  getCollectionData,
  address
}) => {
  const { collection_id } = useParams<{collection_id: string}>()

  // @ts-ignore
  const collection: TCollection | undefined = collections.find(collection => String(collection.collection_id) === collection_id)

  useEffect(() => {
    if (collection_id) {
      getCollectionData(collection_id)
    }
  }, [])

  if (!collection) {
    return <Redirect to='/collections' />
  }

  const {
    symbol,
    token_standard,
    token_address,
    tokens,
    thumbnail,
    title,
    links_count,
    tokens_amount
  } = collection


  const tokensList = renderTokens(
    loading,
    collection_id,
    tokens
  )

  return <ContainerStyled>
    <MainContent>
      <WidgetComponentStyled>
        <Header>
          <WidgetTitleStyled>Tokens</WidgetTitleStyled>
          <ContainerButton
            title='+ Add'
            disabled={loading}
            size='extra-small'
            to={`/collections/${collection_id}/token/new`}
            appearance='action'
          />
        </Header>
        <WidgetSubtitle>  
          {tokens && tokens.length > 0 ? 'You can add more NFTs to this collection' : 'No tokens in this collection yet' }
        </WidgetSubtitle>
      </WidgetComponentStyled>
      {tokensList}
    </MainContent>

    <div>
      <Status
        status={defineCollectionStatus(
          loading,
          links_count || 0,
          tokens_amount ? Number(tokens_amount) : 0
        )}
      />
      <CollectionDetails
        symbol={symbol}
        tokenType={token_standard}
        tokenAddress={token_address as string}
        image={thumbnail as string}
        userAddress={address}
        name={title}
        chainId={chainId as number}
      />
    </div>
    
  </ContainerStyled>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(Collection)
import { FC, useState } from 'react'
import {
  WidgetStyled,
  InputStyled,
  WidgetSubtitleStyled,
  ButtonStyled
} from './styled-components'
import { RootState, IAppDispatch } from 'data/store'
import {
  InputTitleAdditional,
  InputTitle,
  InputContainer,
  ButtonsContainer
} from 'components/pages/common'
import { generateTokenSymbol } from 'helpers'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import * as asyncCollectionsActions from 'data/store/reducers/collections/async-actions'

const defineIfButtonDisabled = (
  title: string,
  loading: boolean
) => {
  return !title || loading
}

const mapStateToProps = ({
  collections: {
    collections,
    loading
  }
}: RootState) => ({
  collections,
  loading
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    createCollectionERC1155: (
      title: string,
      symbol: string,
      callback?: (collection_id: string) => void
    ) => dispatch(asyncCollectionsActions.createCollectionERC1155(
      title,
      symbol,
      callback
    ))
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CollectionsCreateInitial: FC<ReduxType> = ({
  loading,
  createCollectionERC1155
}) => {
  const [title, setTitle] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const history = useHistory()

  return <WidgetStyled title='Collection setup'>
    <WidgetSubtitleStyled>
      Select the way you’d prefer to create and distribute tokens
    </WidgetSubtitleStyled>
    <InputContainer>
      <InputTitle>
        Collection Title <InputTitleAdditional>(max. 200 symbols)</InputTitleAdditional>
      </InputTitle>
      <InputStyled
        disabled={loading}
        value={title}
        onChange={(value) => {
          setTitle(value)
          return value
        }}
      />
    </InputContainer>

    <InputContainer>
      <InputTitle>
        Collection Symbol <InputTitleAdditional>(optional, not more than 5 symbols recommended)</InputTitleAdditional>
      </InputTitle>
      <InputStyled
        disabled={loading}
        value={symbol}
        onChange={(value) => {
          setSymbol(value.toUpperCase())
          return value
        }}
        note='If you don’t know what a symbol is, keep it blank, and we will use the auto-generated one based on title'
      />
    </InputContainer>

    <ButtonsContainer>
      <ButtonStyled
        onClick={() => {
          history.push('/collections')
        }}
      >
        Back
      </ButtonStyled>

      <ButtonStyled
        appearance='action'
        loading={loading}
        disabled={defineIfButtonDisabled(title, loading)}
        onClick={() => {
          const actualSymbol = symbol || generateTokenSymbol(title)
          createCollectionERC1155(
            title,
            actualSymbol,
            (collection_id: string) => history.push(`/collections/${collection_id}`)
          )
        }}
      >
        Deploy Collection
      </ButtonStyled>
    </ButtonsContainer>

  </WidgetStyled>
}

export default connect(mapStateToProps, mapDispatcherToProps)(CollectionsCreateInitial)

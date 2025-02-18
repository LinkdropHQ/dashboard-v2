import { FC, useState } from 'react'
import {
  InputsContainer,
  InputStyled,
  ButtonStyled,
  Text,
  NotesContainer,
  SelectStyled,
  Container,
  Header,
  WidgetTitleStyled,
  HeaderButtons,
  ButtonHeaderStyled
} from '../../styled-components'
import { TProps } from './type'
import LinksContents from '../links-contents'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  TTokenType,
  TLinkContent,
  TNFTToken,
  TClaimPattern
} from 'types'
import {
  WidgetComponent
} from 'components/pages/common'
import {
  alertError,
  defineIfUserOwnsToken,
  shortenString,
  defineNetworkName,
  defineFirstTokenIdForUser,
  defineIfUserOwnsTokenInArray,
  defineLastTokenIdForUser
} from 'helpers'
import { EditPopup } from './components'
import { plausibleApi } from 'data/api'
import chains from 'configs/chains'
import { BigNumber } from 'ethers5'

const defaultNumberInput = (
  claimPattern: TClaimPattern,
  chainId: number
) => {
  const chainConfig = chains[chainId]
  if (chainConfig && !chainConfig.alchemySupport) {
    return false
  }
  return claimPattern === 'mint'
}

const mapStateToProps = ({
  user: {
    address,
    chainId,
    loading: userLoading,
    nfts,
    signer
  },
  campaign: {
    loading,
    decimals,
    symbol,
    claimPattern,
    tokenStandard,
    tokenAddress
  }
}: RootState) => ({
  loading,
  address,
  decimals,
  chainId,
  symbol,
  userLoading,
  claimPattern,
  tokenStandard,
  tokenAddress,
  nfts,
  signer
})

const defineNFTTokensOptions = (nftTokens: TNFTToken[], tokenAddress: string | null) => {
  if (!tokenAddress) { return [] }
  const options = nftTokens.map(singleToken => {
    return {
      label: `${singleToken.title} #${shortenString(singleToken.tokenId)} (x ${singleToken.balance})`,
      value: singleToken
    }
  })
  return options
}

const createInputsContainer = (
  formData: TLinkContent,
  nfts: TNFTToken[],
  assetsData: TLinkContent[],
  setFormData: (link: TLinkContent) => void,
  setAssetsData: (newAssets: TLinkContent[]) => void,
  checkIfDisabled: () => boolean,
  getDefaultValues: (tokenType: TTokenType) => TLinkContent,
  claimPattern: TClaimPattern
) => {
  return <>
    <Text>Enter amount of tokens to distribute and add to selection. By default selection starts from the first ID from your collection</Text>
    <InputsContainer>
      <InputStyled
        value={formData.tokenId}
        placeholder='Number of tokens'
        onChange={value => {
          const pattern = /^[0-9]+$/
          if (pattern.test(value)) {
            setFormData({ ...formData, tokenId: value })
          }
          return value
        }}
      />

      <ButtonStyled
        size='extra-small'
        disabled={checkIfDisabled()}
        appearance='additional'
        onClick={() => {

          const { tokenId: numberToAdd } = formData
          const result: TLinkContent[] = []
          
          if (numberToAdd) {
            const nftsClone = [...nfts].slice(0, Number(numberToAdd))
            nftsClone.forEach(nft => {
              result.push(
                {
                  ...formData,
                  tokenId: nft.tokenId,
                  id: Number(nft.tokenId),
                  tokenAmount: "1",
                  linksAmount: nft.balance,
                  type: 'ERC1155',
                  tokenImage: (nft.media[0] || {}).gateway,
                  tokenName: nft.title,
                }
              ) 
            })
          }
          
          setAssetsData([ ...assetsData, ...result ])
          setFormData(getDefaultValues('ERC721'))
        }}
      >
        + Add
      </ButtonStyled>
    </InputsContainer>
  </>
}

const createSelectContainer = (
  assetsData: TLinkContent[],
  setFormData: (link: TLinkContent) => void,
  setAssetsData: (newAssets: TLinkContent[]) => void,
  getDefaultValues: (tokenType: TTokenType) => TLinkContent,
  nfts: TNFTToken[],
  tokenAddress: string | null,
  userAddress: string,
  signer: any,
  checkIfDisabled: () => boolean,
  claimPattern: TClaimPattern
) => {
  const nftsToShow = nfts.filter(nft => {
    const tokenIsChosen = assetsData.find(asset => asset.tokenId === nft.tokenId)
    if (tokenIsChosen) {
      return false
    }
    return true
  })
  return <>
    <Text>Choose tokens to distribute manually by selecting IDs one-by-one</Text>
    <InputsContainer>
      <SelectStyled
        disabled={checkIfDisabled()}
        onChange={async ({ value }: { value: string | TNFTToken }) => {
          const tokenId = typeof value === 'string' ? value : value.tokenId
          const tokenAlreadyAdded = assetsData.find(asset => asset.tokenId === tokenId)
          if (tokenAlreadyAdded) {
            return alertError(`Token #${tokenId} was already added`)
          }

          // if "not found" was clicked
          if (typeof value === 'string') {
            if (claimPattern === 'mint') {
              return setAssetsData([
                ...assetsData, {
                  tokenId: value,
                  tokenAmount: "1",
                  linksAmount: "1",
                  type: 'ERC1155',
                  id: assetsData.length,
                  tokenName: 'Token ERC1155'
                }
              ])
            }
            const userOwnership = await defineIfUserOwnsToken(
              userAddress,
              'ERC1155',
              tokenAddress as string,
              signer,
              tokenId
            )

            if (!userOwnership.owns) {
              return alertError(`Token #${tokenId} is not owned by current user`)
            }

            setAssetsData([
              ...assetsData, {
                tokenId: tokenId,
                tokenAmount: "1",
                linksAmount: "1",
                type: 'ERC1155',
                id: assetsData.length,
                tokenName: 'Token ERC1155'
              }
            ])
          } else {          
            setAssetsData([
              ...assetsData, {
                tokenId: tokenId,
                tokenAmount: "1",
                linksAmount: String(value.balance),
                type: 'ERC1155',
                id: assetsData.length,
                tokenImage: (value.media[0] || {}).gateway,
                tokenName: value.title
              }
            ])
          }
          setFormData(getDefaultValues('ERC1155'))
        }}
        value={null}
        placeholder='Token ID'
        options={defineNFTTokensOptions(nftsToShow, tokenAddress)}
        notFoundActiveCondition={(value) => {
          return value.length > 0 && (/^[0-9]+$/).test(value)
        }}
      />
    </InputsContainer>
  </>
}

const createTextInputOrSelect = (
  enabledInput: boolean,
  formData: TLinkContent,
  assetsData: TLinkContent[],
  setFormData: (link: TLinkContent) => void,
  setAssetsData: (newAssets: TLinkContent[]) => void,
  checkIfDisabled: () => boolean,
  getDefaultValues: (tokenType: TTokenType) => TLinkContent,
  nfts: TNFTToken[],
  tokenAddress: string | null,
  userAddress: string,
  signer: any,
  claimPattern: TClaimPattern,
  collectionId?: null | string 
) => {
  if (collectionId) {
    return null
  }
  if (enabledInput) {
    return createInputsContainer(
      formData,
      nfts,
      assetsData,
      setFormData,
      setAssetsData,
      checkIfDisabled,
      getDefaultValues,
      claimPattern
    )
  }

  return createSelectContainer(
    assetsData,
    setFormData,
    setAssetsData,
    getDefaultValues,
    nfts,
    tokenAddress,
    userAddress,
    signer,
    checkIfDisabled,
    claimPattern
  )

}

type ReduxType = ReturnType<typeof mapStateToProps> &
  TProps

const Erc1155: FC<ReduxType > = ({
  tokenStandard,
  setAssetsData,
  assetsData,
  children,
  sdk,
  claimPattern,
  nfts,
  tokenAddress,
  address,
  signer,
  loading,
  userLoading,
  chainId,
  getDefaultValues,
  formData,
  setFormData,
  collectionId
}) => {
  const { type } = useParams<{ type: TTokenType }>()

  const [ numberInput, toggleNumberInput ] = useState<boolean>(
    defaultNumberInput(
      claimPattern,
      chainId as number
    )
  )

  const [
    itemToEdit,
    setItemToEdit
  ] = useState<number | string | null>(null)

  const checkIfDisabled = () => {
    if (userLoading || loading) { return true }
    if (numberInput) {
      return !formData.tokenId
    }
    return false
  }

  const checkIfAllTokensDisabled = () => {
    if (!tokenAddress) { return true }
    if (!nfts || nfts.length === 0) { return true }
    if (sdk) { return true }
    return false
  }

  const addAllTokens = async () => {
    if (!tokenAddress) { return }
    const assets: TLinkContent[] = nfts.map((token, idx) => {
      return {
        tokenId: token.tokenId,
        linksAmount: String(token.balance),
        id: idx,
        type: 'ERC1155',
        tokenImage: (token.media[0] || {}).gateway,
        tokenName: token.title,
        tokenAmount: "1"
      }
    })
    plausibleApi.invokeEvent({
      eventName: 'camp_step3_selectall',
      data: {
        network: defineNetworkName(chainId),
        token_type: tokenStandard as string,
      }
    })
    setAssetsData(assets)
    setFormData(getDefaultValues('ERC1155'))
  }

  return <WidgetComponent>
    {itemToEdit !== null && <EditPopup
      onClose={() => {
        setItemToEdit(null)
      }}
      assets={assetsData}
      id={itemToEdit}
      onUpdate={(assetId, linksAmount) => {
        const assetsDataUpdated = assetsData.map(asset => {
          if (asset.id === assetId) {
            return {
              ...asset,
              linksAmount: linksAmount
            }
          }
          return asset
        })
        setAssetsData(assetsDataUpdated)
        setItemToEdit(null)
      }}
    />}
    <Header>
      <WidgetTitleStyled>
        Add token IDs to distribute
      </WidgetTitleStyled>

      {!collectionId && <HeaderButtons>
        {claimPattern !== 'mint' && <ButtonHeaderStyled
          disabled={checkIfAllTokensDisabled()}
          appearance='additional'
          size='extra-small'
          onClick={() => {
            const newValue = !numberInput
            if (newValue) {
              plausibleApi.invokeEvent({
                eventName: 'camp_step3_by_number',
                data: {
                  network: defineNetworkName(chainId),
                  token_type: tokenStandard as string
                }
              })
            }
            toggleNumberInput(newValue)
          }}
        >
          {numberInput ? 'Pick token IDs' : 'Set manually'}
        </ButtonHeaderStyled>}
        {claimPattern !== 'mint' && <ButtonHeaderStyled
          disabled={checkIfAllTokensDisabled()}
          appearance='action'
          size='extra-small'
          onClick={addAllTokens}
        >
          Select All
        </ButtonHeaderStyled>}
      </HeaderButtons>}
    </Header>
    <Container>
      {createTextInputOrSelect(
        numberInput,
        formData,
        assetsData,
        setFormData,
        setAssetsData,
        checkIfDisabled,
        getDefaultValues,
        nfts,
        tokenAddress,
        address,
        signer,
        claimPattern,
        collectionId
      )}
      <LinksContents
        type={type}
        data={assetsData}
        claimPattern={claimPattern}
        sdk={sdk}
        onRemove={(id) => {
          setAssetsData(assetsData.filter(item => item.id !== id))
        }}
        collectionId={collectionId}
        onEdit={(id) => {
          setItemToEdit(id)
        }}
      />
      
      <NotesContainer>
        {children}
      </NotesContainer>
    </Container>
  </WidgetComponent>
}

// @ts-ignore
export default connect(mapStateToProps)(Erc1155)

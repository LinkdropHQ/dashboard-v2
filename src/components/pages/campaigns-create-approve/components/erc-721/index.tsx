import { FC, useState } from 'react'
import {
  InputsContainer,
  InputStyled,
  ButtonStyled,
  NotesContainer,
  SelectStyled,
  Container,
  Header,
  WidgetTitleStyled,
  HeaderButtons,
  ButtonHeaderStyled,
  Text
} from '../../styled-components'
import {
  defineIfUserOwnsToken,
  shortenString,
  defineNetworkName,
  defineFirstTokenIdForUser,
  defineIfUserOwnsTokenInArray,
  defineLastTokenIdForUser
} from 'helpers'
import { TProps } from './type'
import chains from 'configs/chains'
import { alertError } from 'helpers'
import LinksContents from '../links-contents'
import { RootState } from 'data/store';
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  TTokenType,
  TLinkContent,
  TClaimPattern,
  TNFTToken,
} from 'types'
import {
  WidgetComponent
} from 'components/pages/common'
import { plausibleApi } from 'data/api'
import { BigNumber } from 'ethers5'

const mapStateToProps = ({
  user: {
    address,
    signer,
    chainId,
    loading: userLoading,
    nfts
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
  signer,
  decimals,
  chainId,
  symbol,
  tokenStandard,
  userLoading,
  claimPattern,
  tokenAddress,
  nfts
})

const defineNFTTokensOptions = (nftTokens: TNFTToken[], tokenAddress: string | null) => {
  if (!tokenAddress) { return [] }
  if (!nftTokens) { return [] }
  const options = nftTokens.map(singleToken => {
    return {
      label: `${singleToken.title || 'ERC721 Token'} #${shortenString(singleToken.tokenId)}`,
      value: singleToken
    }
  })
  return options
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  TProps

const createInputsContainer = (
  formData: TLinkContent,
  nfts: TNFTToken[],
  claimPattern: TClaimPattern,
  assetsData: TLinkContent[],
  setFormData: (link: TLinkContent) => void,
  setAssetsData: (newAssets: TLinkContent[]) => void,
  checkIfDisabled: () => boolean,
  getDefaultValues: (tokenType: TTokenType) => TLinkContent
) => {
  return <>
    <Text>Enter amount of tokens to distribute and add to selection. By default selection starts from the first ID from your collection</Text>
    <InputsContainer>
      <InputStyled
        value={formData.tokenId}
        placeholder='Number of tokens'
        disabled={claimPattern === 'mint' && Boolean(assetsData.length)}
        onChange={value => {
          const pattern = /^[0-9]+$/
          if (pattern.test(value) || value === '') {
            setFormData({
              ...formData,
              tokenId: value
            })
          }
          return value
        }}
      />

      <ButtonStyled
        size='extra-small'
        appearance='additional'
        disabled={checkIfDisabled()}
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
                  type: 'ERC721',
                  tokenImage: (nft.media[0] || {}).gateway,
                  tokenName: nft.title 
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
        onChange={async ({ value }) => {
          const tokenId = typeof value === 'string' ? value : value.tokenId
          const tokenAlreadyAdded = assetsData.find(asset => asset.tokenId === tokenId)
          if (tokenAlreadyAdded) {
            return alertError(`Token #${tokenId} was already added`)
          }

          if (typeof value === 'string') {
            // if "not found" was clicked
            const userOwnership = await defineIfUserOwnsToken(
              userAddress,
              'ERC721',
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
                type: 'ERC721',
                id: assetsData.length,
                tokenName: 'Token ERC721'
              }
            ])

            
          } else {
            const tokenAlreadyAdded = assetsData.find(asset => asset.tokenId === value.id)
            if (tokenAlreadyAdded) {
              return alertError(`Token #${tokenId} was already added`)
            }
            
            setAssetsData([
              ...assetsData, {
                tokenId: tokenId,
                tokenAmount: "1",
                linksAmount: "1",
                type: 'ERC721',
                id: assetsData.length,
                tokenImage: (value.media[0] || {}).gateway,
                tokenName: value.name
              }
            ])
            setFormData(getDefaultValues('ERC721'))
          }
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
  claimPattern: TClaimPattern,
  assetsData: TLinkContent[],
  setFormData: (link: TLinkContent) => void,
  setAssetsData: (newAssets: TLinkContent[]) => void,
  checkIfDisabled: () => boolean,
  getDefaultValues: (tokenType: TTokenType) => TLinkContent,
  nfts: TNFTToken[],
  tokenAddress: string | null,
  userAddress: string,
  signer: any
) => {

  if (enabledInput) {
    return createInputsContainer(
      formData,
      nfts,
      claimPattern,
      assetsData,
      setFormData,
      setAssetsData,
      checkIfDisabled,
      getDefaultValues
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
    checkIfDisabled
  )
}

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

const Erc721: FC<ReduxType > = ({
  tokenStandard,
  setAssetsData,
  assetsData,
  claimPattern,
  children,
  sdk,
  tokenAddress,
  nfts,
  signer,
  address,
  loading,
  userLoading,
  chainId,
  formData,
  setFormData,
  getDefaultValues
}) => {
  const { type } = useParams<{ type: TTokenType }>()

  const [
    numberInput,
    toggleNumberInput
  ] = useState<boolean>(defaultNumberInput(
    claimPattern,
    chainId as number
  ))

  const nftsToShow = nfts.filter(nft => {
    const tokenIsChosen = assetsData.find(asset => asset.tokenId === nft.tokenId)
    if (tokenIsChosen) {
      return false
    }
    return true
  })

  const checkIfDisabled = () => {
    if (loading || userLoading) { return true }
    if (claimPattern === 'mint') {
      return Boolean(assetsData.length)
    }
    if (numberInput) {
      return !formData.tokenId || formData.tokenId.length === 0
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
    if (!tokenAddress) { return true }
    const assets: TLinkContent[] = nftsToShow.map((token, idx) => {
      return {
        tokenId: token.tokenId,
        linksAmount: '1',
        id: idx,
        type: 'ERC721',
        tokenImage: (token.media[0] || {}).gateway,
        tokenName: token.title 
      }
    })

    setAssetsData(assets)
    plausibleApi.invokeEvent({
      eventName: 'camp_step3_selectall',
      data: {
        network: defineNetworkName(chainId),
        token_type: tokenStandard as string,
      }
    })
    setFormData(getDefaultValues('ERC721'))
  }

  return <WidgetComponent>
    <Header>
      <WidgetTitleStyled>
        Add token IDs to distribute
      </WidgetTitleStyled>
      <HeaderButtons>
        <ButtonHeaderStyled
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
          {numberInput ? 'Manually' : 'By number'}
        </ButtonHeaderStyled>
        <ButtonHeaderStyled
          disabled={checkIfAllTokensDisabled()}
          appearance='action'
          size='extra-small'
          onClick={addAllTokens}
        >
          Select All
        </ButtonHeaderStyled>
      </HeaderButtons>
    </Header>
    <Container>
      {createTextInputOrSelect(
        numberInput,
        formData,
        claimPattern,
        assetsData,
        setFormData,
        setAssetsData,
        checkIfDisabled,
        getDefaultValues,
        nfts,
        tokenAddress,
        address,
        signer
      )}
      <LinksContents
        type={type}
        claimPattern={claimPattern}
        sdk={sdk}
        data={assetsData}
        onRemove={(id) => {
          setAssetsData(assetsData.filter(item => item.id !== id))
        }}
      />
      <NotesContainer>
        {children}
      </NotesContainer>
    </Container>
  </WidgetComponent>
}

// @ts-ignore
export default connect(mapStateToProps)(Erc721)

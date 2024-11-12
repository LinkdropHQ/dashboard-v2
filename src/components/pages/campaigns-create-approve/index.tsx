import { FC, useEffect, useRef, useState } from 'react'
import {
  StyledRadio,
  InstructionNoteStyled,
} from './styled-components'
import { Erc20, Erc721, Erc1155, CSVUploadPopup, SDKLinks, AsideContents } from './components'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TAssetsData, TLinkContent, TLinkParams, TTokenType, TTotalAmount } from 'types'
import { TDefineComponent, TLinksContent } from './types'
import { RootState, IAppDispatch } from 'data/store'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import * as userAsyncActions from 'data/store/reducers/user/async-actions/index'
import Icons from 'icons'
import { useQuery } from 'hooks'
import { TextLink } from 'components/common'
import {
  WidgetComponent,
  Container,
  Aside,
  WidgetSubtitle,
  WidgetContainer,
} from 'components/pages/common'
import { useHistory } from 'react-router-dom'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import {
  convertLinksContent,
  defineNativeTokenSymbol,
  countNativeTokensToSecure,
  alertError,
  countAssetsTotalAmountERC20,
  preventPageClose
} from 'helpers'
import { TAsideContentsProps } from './components/aside-contents/types'
import { plausibleApi } from 'data/api'
const {
  REACT_APP_STARTER_PLAN_LINKS_LIMIT,
  REACT_APP_PRO_PLAN_LINKS_LIMIT
} = process.env

const mapStateToProps = ({
  campaign: {
    tokenStandard,
    loading,
    claimPattern,
    sdk,
    tokenAddress,
    decimals,
    proxyContractAddress,
    title,
    assets,
    symbol,
    approved,
    collectionId
  },
  campaigns: {
    campaigns
  },
  user: {
    chainId,
    comission,
    whitelisted
  },
  collections: {
    collections
  }
}: RootState) => ({
  tokenStandard,
  loading,
  campaigns,
  collections,
  collectionId,
  claimPattern,
  sdk,
  proxyContractAddress,
  approved,
  tokenAddress,
  decimals,
  chainId,
  title,
  symbol,
  assets,
  comission,
  whitelisted
})

const getDefaultValues = (type: TTokenType) => {
  return {
    linksAmount: '',
    tokenId: '',
    tokenAmount: '',
    type: type
  }
}

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    checkIfApproved: () => {
      dispatch(
        userAsyncActions.checkIfApproved()
      )
    },
    setApproved: (approved: boolean) => {
      dispatch(
        campaignActions.setApproved(approved)
      )
    },
    checkIfGranted: () => {
      dispatch(
        userAsyncActions.checkIfGranted()
      )
    },
    approveERC20: (
      assets: TAssetsData,
      totalAmount: TTotalAmount,
      assetsOriginal: TLinkContent[],
      sdk: boolean,
      sponsored: boolean,
      isNewCampaign: boolean,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.approveERC20(
          assets,
          totalAmount,
          assetsOriginal,
          sdk,
          sponsored,
          isNewCampaign,
          callback
        )
        )
    },
    approveAllERC20: (
      assets: TAssetsData,
      assetsOriginal: TLinkContent[],
      sdk: boolean,
      sponsored: boolean,
      isNewCampaign: boolean,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.approveAllERC20(
          assets,
          assetsOriginal,
          sdk,
          sponsored,
          isNewCampaign,
          callback
        )
        )
    },
    approveERC721: (
      assets: TAssetsData,
      assetsOriginal: TLinkContent[],
      sdk: boolean,
      sponsored: boolean,
      isNewCampaign: boolean,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.approveERC721(
          assets,
          assetsOriginal,
          sdk,
          sponsored,
          isNewCampaign,
          callback
        )
      )
    },
    approveERC1155: (
      assets: TAssetsData,
      assetsOriginal: TLinkContent[],
      sdk: boolean,
      sponsored: boolean,
      isNewCampaign: boolean,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.approveERC1155(
          assets,
          assetsOriginal,
          sdk,
          sponsored,
          isNewCampaign,
          callback
        )
      )
    },
    grantRole: (
      assets: TAssetsData,
      assetsOriginal: TLinkContent[],
      sdk: boolean,
      sponsored: boolean,
      isNewCampaign: boolean,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.grantRole(
          assets,
          assetsOriginal,
          sdk,
          sponsored,
          isNewCampaign,
          callback
        )
      )
    },
    getUserNFTs: (
      tokenType: TTokenType
    ) => dispatch(
      campaignAsyncActions.getUserNFTs(tokenType)
    ),
    setAssetsData: (
      assets: TAssetsData,
      assetsOriginal: TLinkContent[],
      callback: () => void
    ) => dispatch(campaignAsyncActions.setAssetsData(
        assets,
        assetsOriginal,
        callback
      )
    ),
    clearCampaign: () => {
      dispatch(
        campaignActions.clearCampaign()
      )
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const defineComponent: TDefineComponent = (
  type,
  assetsData,
  setAssetsData,
  claimPattern,
  setUploadCSVPopup,
  sponsored,
  sdk,
  formData,
  setFormData,
  getDefaultValues,
  campaign,
  collectionId
) => {

  if (!sponsored && sdk) {
    return null
  }

  if (sdk) {
    return <SDKLinks
      type={type}
      sdk={sdk}
      campaign={campaign}
      assetsData={assetsData}
      setAssetsData={setAssetsData}
    />
  }

  const UploadInstructionNote =
    (
      type === 'ERC721' &&
      claimPattern === 'mint'
    ) ||
    collectionId
  ?
    null :
    <InstructionNoteStyled
      icon={<Icons.UploadFileIcon />}
    >
    If you have a big set of different tokens to distribute, you could also provide this information by <TextLink onClick={setUploadCSVPopup}>uploading a CSV file. </TextLink>
  </InstructionNoteStyled>

  switch(type.toUpperCase()) {
    case 'ERC20':
      return <Erc20
        sdk={sdk}
        formData={formData}
        setFormData={setFormData}
        getDefaultValues={getDefaultValues}
        type={type}
        campaign={campaign}
        assetsData={assetsData}
        setAssetsData={setAssetsData}
    >
      {UploadInstructionNote}
    </Erc20>
    case 'ERC721':
      return <Erc721
        sdk={sdk}
        type={type}
        formData={formData}
        setFormData={setFormData}
        getDefaultValues={getDefaultValues}
        campaign={campaign}
        assetsData={assetsData}
        setAssetsData={setAssetsData}
      >
        {UploadInstructionNote}
      </Erc721>
    default:
      return <Erc1155
        type={type}
        sdk={sdk}
        formData={formData}
        setFormData={setFormData}
        getDefaultValues={getDefaultValues}
        campaign={campaign}
        assetsData={assetsData}
        setAssetsData={setAssetsData}

        // needed for own collection campaigns
        collectionId={collectionId}
        
      >
        {UploadInstructionNote}
      </Erc1155>
  }
}

const defineDefaultSponsoredValue = (chainId: number) => {
  if (chainId === 1) {
    return false
  }

  return true
} 

const renderAsideContents = ({
  approved,
  sdk,
  campaignTitle,
  tokenAddress,
  campaignSymbol,
  campaignTokenStandard,
  campaignChainId,
  assetsParsed,
  claimPattern,
  data,
  sponsored,
  totalComission,
  symbol
}: TAsideContentsProps) => {
  return <AsideContents
    approved={approved}
    sdk={sdk}
    campaignTitle={campaignTitle}
    tokenAddress={tokenAddress}
    campaignSymbol={campaignSymbol}
    campaignTokenStandard={campaignTokenStandard}
    campaignChainId={campaignChainId}
    assetsParsed={assetsParsed}
    claimPattern={claimPattern}
    data={data}
    sponsored={sponsored}
    totalComission={totalComission}
    symbol={symbol}
  />
}

const CampaignsCreateApprove: FC<ReduxType> = ({
  campaigns,
  sdk: initialSdk,
  tokenAddress,
  decimals,
  chainId,
  tokenStandard,
  title,
  loading,
  grantRole,
  approveERC20,
  approveERC721,
  approveERC1155,
  claimPattern,
  checkIfApproved,
  checkIfGranted,
  symbol,
  approved,
  setApproved,
  approveAllERC20,
  comission: comissionPrice,
  whitelisted,
  getUserNFTs,
  collections,
  collectionId
}) => {
  const [
    assetsParsed,
    setAssetsParsedValue
  ] = useState<TAssetsData>([])

  const history = useHistory()
  const { type, id } = useParams<TLinkParams>()
  const queryParams = useQuery()
  const currentCampaign = id ? campaigns.find(campaign => campaign.campaign_id === id) : null
  const currentTokenAddress = currentCampaign ? currentCampaign.token_address : tokenAddress
  const currentCampaignChainId = currentCampaign ? currentCampaign.chain_id : chainId
  const currentCampaignTokenStandard = currentCampaign ? currentCampaign.token_standard : tokenStandard
  const currentCampaignTitle = currentCampaign ? currentCampaign.title : title
  const currentCampaignSymbol = currentCampaign ? currentCampaign.symbol : symbol
  const currentCampaignSdk = currentCampaign ? currentCampaign.sdk : initialSdk
  const currentCampaignSponsored = currentCampaign ? currentCampaign.sponsored : defineDefaultSponsoredValue(chainId as number)

  const defineRedirectUrl = () => {
    return currentCampaign ? `/campaigns/edit/${tokenStandard}/${currentCampaign.campaign_id}/secure` : `/campaigns/new/${tokenStandard}/secure`
  }

  const [ sdk, setSdk ] = useState<boolean>(currentCampaignSdk)

  const [ data, setData ] = useState<TLinksContent>([])

  const [
    formData,
    setFormData
  ] = useState<TLinkContent>(
    getDefaultValues(type)
  )

  const [ uploadCSVPopup, setUploadCSVPopup ] = useState<boolean>(false)
  const [ sponsored, setSponsored ] = useState<boolean>(Boolean(currentCampaignSponsored))
  const nativeTokenSymbol = defineNativeTokenSymbol({ chainId })
  const content = defineComponent(
    type,
    data, // assetsData
    setData, // setAssetsData
    claimPattern,
    () => setUploadCSVPopup(true),
    sponsored,
    sdk,
    formData,
    setFormData,
    getDefaultValues,
    currentCampaign,
    collectionId
  )

  const defineIfNextDisabled = () => {
    return loading
  }

  useEffect(() => {
    if (!currentCampaign) {
      return setApproved(false)
    }
    if (currentCampaign.claim_pattern === 'mint') {
      return checkIfGranted()
    }
    if (tokenStandard === 'ERC20') {
      return setApproved(false)
    }
    checkIfApproved()
  }, [])

  useEffect(preventPageClose(), [])

  const defineNextButtonTitle = () => {
    if (loading) {
      return 'Loading'
    }
    if (approved || approved === null) {
      return 'Continue'
    }
    return claimPattern === 'transfer' ? 'Approve' : 'Grant Role'
  }

  useEffect(() => {
    if (!data || decimals === null) { return setAssetsParsedValue([]) }
    let assets = convertLinksContent(data, decimals, claimPattern, sdk)
    if (!assets) { return setAssetsParsedValue([]) }
    setAssetsParsedValue(assets)
  }, [data])

  useEffect(() => {
    // it will work for ouwn collection (from minter)
    if (tokenStandard === 'ERC1155') {
      const tokenId = queryParams.get('token_id')
      const linksAmount = queryParams.get('links_amount')
      const collectionId = queryParams.get('collection_id')
      if (tokenId && linksAmount && collectionId) {
        const collection = collections.find(collection => collection.collection_id === collectionId)
        if (collection) {
          const token = collection.tokens && collection.tokens.find(token => token.token_id === tokenId)
          if (token) {
            setData([{
              tokenId: tokenId as string,
              tokenAmount: "1",
              linksAmount: linksAmount as string,
              type: 'ERC1155',
              id: data.length,
              tokenName: token.name,
              tokenImage: token.thumbnail
            }])
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    getUserNFTs(type)
  }, [])

  const isSponsored = [
    { value: true, label: `Sponsor claiming gas fees (+ ${comissionPrice} ${nativeTokenSymbol} per link)` },
    { value: false, label: `No sponsoring` }
  ]

  const {
    totalComission
  } = countNativeTokensToSecure(
    '0',
    assetsParsed,
    comissionPrice,
    sponsored
  )
  
  return <Container>
    {uploadCSVPopup && <CSVUploadPopup
      onClose={() => setUploadCSVPopup(false)}
      onUpload={(assets: TLinksContent) => {
        setData(data => [...data, ...assets])
        setUploadCSVPopup(false)
        plausibleApi.invokeEvent({
          eventName: 'camp_step3_csv',
        })
      }}
      tokenStandard={tokenStandard}
      claimPattern={claimPattern}
    />}
    <WidgetContainer>
      {false && <WidgetComponent title='Distribution'>
        <WidgetSubtitle>Select the way you’d prefer to create and distribute tokens</WidgetSubtitle>
        <StyledRadio
          disabled={Boolean(currentCampaign) || loading}
          radios={[
            { label: 'Manual (Select tokens to generate links)', value: false },
            { label: 'SDK (Set up and use our SDK to generate links on the fly)', value: true }
          ]}
          value={sdk}
          onChange={value => {
            setData([])
            setSdk(value)
          }}
        />
      </WidgetComponent>}
      {false && <WidgetComponent title='Gasless Claiming'>
        <WidgetSubtitle>Selecting to sponsor transactions will allow users to claim tokens without having any {nativeTokenSymbol} in their wallets, otherwise users will pay gas to cover transactions themselves</WidgetSubtitle>
        <StyledRadio
          disabled={Boolean(currentCampaign) || loading}
          radios={isSponsored}
          value={sponsored}
          onChange={value => {
            setData([])
            setSponsored(value)
          }}
        />
      </WidgetComponent>}
      
      {content}
    </WidgetContainer>

    <Aside
      back={{
        action: () => {
          history.goBack()
        }
      }}
      next={{
        title: defineNextButtonTitle(),
        action: () => {
          let assetsCurrent = assetsParsed
          let dataCurrent = data
          if ((!data.length || !assetsParsed) && !sdk) {
            if (tokenStandard === 'ERC20') {
              if (!formData.linksAmount && !formData.tokenAmount) {
                return alert('No assets added for distribution')
              }
            }
            if (tokenStandard === 'ERC721') {
              if (!formData.tokenId) {
                return alert('No assets added for distribution')
              }
            }
            if (tokenStandard === 'ERC1155') {
              if (!formData.tokenId) {
                return alert('No assets added for distribution')
              }
            }
            const dataCurrent = [ ...data, {
              ...formData,
              id: data.length
            }]
            assetsCurrent = convertLinksContent(dataCurrent, decimals as number, claimPattern, sdk)
            setData(dataCurrent)
            setAssetsParsedValue(assetsCurrent)
            setFormData(getDefaultValues(tokenStandard as TTokenType))
            // return alert('Your assets data was submitted. Please continue')
          }
          const callback = () => {
            history.push(defineRedirectUrl())
          }
          if (whitelisted && REACT_APP_PRO_PLAN_LINKS_LIMIT && assetsParsed.length > Number(REACT_APP_PRO_PLAN_LINKS_LIMIT as string)) {
            return alertError(`Pro plan is limited to ${REACT_APP_PRO_PLAN_LINKS_LIMIT} links per batch. Contact us if you need to increase limits.`)
          }
          if (!whitelisted && REACT_APP_STARTER_PLAN_LINKS_LIMIT && assetsParsed.length > Number(REACT_APP_STARTER_PLAN_LINKS_LIMIT as string)) {
            return alertError(`Starter plan is limited to ${REACT_APP_STARTER_PLAN_LINKS_LIMIT} links per batch. Upgrade your plan to increase limits.`)
          }
          if (claimPattern === 'mint') {
            return grantRole(
              assetsCurrent,
              dataCurrent,
              sdk,
              sponsored,
              !Boolean(id),
              callback
            )
          }
          if (tokenStandard === 'ERC20') {
            if (sdk) {
              return approveAllERC20(
                assetsCurrent,
                dataCurrent,
                sdk,
                sponsored,
                !Boolean(id),
                callback
              )
            }
            const totalAmount = tokenStandard !== 'ERC20' ? undefined : countAssetsTotalAmountERC20(assetsCurrent, decimals)
            approveERC20(
              assetsCurrent,
              totalAmount as TTotalAmount,
              dataCurrent,
              sdk,
              sponsored,
              !Boolean(id),
              callback
            )
          } else if (tokenStandard === 'ERC721') {
            approveERC721(
              assetsCurrent,
              dataCurrent,
              sdk,
              sponsored,
              !Boolean(id),
              callback
            )
          } else {
            approveERC1155(
              assetsCurrent,
              dataCurrent,
              sdk,
              sponsored,
              !Boolean(id),
              callback
            )
          }
        },
        loading,
        disabled: defineIfNextDisabled()
      }}
      title="Summary"
      subtitle="Check and confirm details"
    >
      {renderAsideContents({
        approved,
        sdk,
        campaignTitle: currentCampaignTitle,
        tokenAddress: currentTokenAddress,
        campaignSymbol: currentCampaignSymbol,
        campaignTokenStandard: currentCampaignTokenStandard,
        campaignChainId: currentCampaignChainId,
        assetsParsed,
        claimPattern,
        data,
        sponsored,
        totalComission,
        symbol
      })}
    </Aside>
    
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsCreateApprove)

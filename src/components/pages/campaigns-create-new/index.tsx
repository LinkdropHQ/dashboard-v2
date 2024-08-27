import { FC, useState, useEffect } from 'react'
import {
  InputStyled,
  SwitcherStyled,
  SelectStyled
} from './styled-components'
import { useParams } from 'react-router-dom'
import {
  WidgetComponent,
  Container,
  Aside,
  WidgetSubtitle,
  TableRow,
  TableText,
  TableValue,
  AsideContent,
  TableValueShorten
} from 'components/pages/common'
import { InformationContainer, TextLink } from 'components/common'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import { TTokenType, TLinkParams, TNFTContract, TERC20Contract } from 'types'
import { useHistory } from 'react-router-dom'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { Dispatch } from 'redux'
import { alertError, preventPageClose } from 'helpers'
import { utils } from 'ethers'
import { defineNetworkName, shortenString, defineTokenType, defineIfUserOwnsContract, defineIfUserOwnsContractERC20 } from 'helpers'
import * as userAsyncActions from 'data/store/reducers/user/async-actions'
import { contractSpecificOptions } from 'configs/contract-specific-options'

const mapStateToProps = ({
  campaign: {
    tokenStandard,
    loading,
    symbol,
    title,
    tokenAddress,
    proxyContractAddress
  },
  campaigns: {
    campaigns
  },
  user: {
    chainId,
    address,
    contracts,
    contractsERC20,
    loading: userLoading,
    signer
  }
}: RootState) => ({
  tokenStandard,
  loading,
  campaigns,
  chainId,
  userLoading,
  address,
  symbol,
  title,
  tokenAddress,
  signer,
  contracts,
  contractsERC20,
  proxyContractAddress
})

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    setTokenContractData: (
      tokenAddress: string,
      type: TTokenType
    ) => dispatch(campaignAsyncActions.setTokenContractData(
      tokenAddress,
      type,
    )),
    setInitialData: (
      tokenStandard: TTokenType,
      title: string,
      isNewCampaign: boolean,
      callback?: () => void
    ) => dispatch(
      campaignAsyncActions.setInitialData(
        tokenStandard,
        title,
        isNewCampaign,
        callback
      )
    ),
    resetCampaign: (
      campaingId?: string
    ) => {
      dispatch(
        campaignAsyncActions.resetCampaign(campaingId)
      )
    },
    getContracts: () => {
      dispatch(
        userAsyncActions.getContracts()
      )
    },
    getERC20Contracts: () => {
      dispatch(
        userAsyncActions.getERC20Contracts()
      )
    }
  }
}

const defineContractsOptions = (contracts: TNFTContract[], contractsERC20: TERC20Contract[], tokenType: string | null) => {
  if (tokenType === 'ERC20') {
    return contractsERC20.map(contract => {
      return {
        label: `${contract.symbol} ${shortenString(contract.address)} (${utils.formatUnits(contract.totalBalance as string, contract.decimals)} owned)`,
        value: contract
      }
    })
  }
  const contractOptions = contracts.map(contract => {
    return {
      label: `${contract.name} ${shortenString(contract.address)} (${contract.totalBalance} owned)`,
      value: contract
    }
  })

  return contractOptions
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignsCreateNew: FC<ReduxType> = ({
  symbol: appliedTokenSymbol,
  chainId,
  address,
  campaigns,
  setTokenContractData,
  setInitialData,
  resetCampaign,
  loading,
  getContracts,
  getERC20Contracts,
  contracts,
  userLoading,
  tokenAddress: appliedTokenAddress,
  contractsERC20,
  signer,
  proxyContractAddress
}) => {
  const history = useHistory()
  const { id } = useParams<TLinkParams>()

  useEffect(preventPageClose(), [])

  const campaign = id ? campaigns.find(campaign => campaign.campaign_id === id) : null
  const currentTokenAddress = campaign ? campaign.token_address : ''
  const currentTokenAddressToShow = currentTokenAddress || appliedTokenAddress
  const currentCampaignType = campaign ? campaign.token_standard : null
  const currentCampaignTitle = campaign ? campaign.title : ''
  const currentTokenSymbol = campaign ? campaign.symbol : ''
  
  const [
    tokenAddress,
    setTokenAddress
  ] = useState<string>(currentTokenAddress)
  
  const [
    title,
    setTitle
  ] = useState<string>(currentCampaignTitle)

  const [ currentType, setCurrentType ] = useState<string | null>(currentCampaignType)
  const [ currentSwitcherValue, setCurrentSwitcherValue ] = useState<string>(currentCampaignType === 'ERC1155' || currentCampaignType === 'ERC721' || !currentCampaignType ? 'nfts' : 'tokens')

  useEffect(() => {
    resetCampaign(campaign?.campaign_number)
  }, [])


  useEffect(() => {
    if ((!currentType || currentType === 'ERC721' || currentType === 'ERC1155')) {
      return getContracts()
    }

    if (currentType === 'ERC20' && contractsERC20.length === 0) {
      return getERC20Contracts()
    }
  }, [currentType])

  useEffect(() => {
    if (!tokenAddress.length) { return }
    setTokenContractData(tokenAddress, currentType as TTokenType)
  }, [tokenAddress, currentType])

  const defineIfNextDisabled = () => {
    return !title || !tokenAddress || !appliedTokenSymbol || loading || !proxyContractAddress
  }

  const selectTokenOptions: any[] = defineContractsOptions(
    contracts,
    contractsERC20,
    currentType
  )

  const selectCurrentValue = () => {
    const currentOption = selectTokenOptions.find(option => option.value.address === tokenAddress)
    if (!currentOption) {
      return null
    }
    if (currentOption) {
      return currentOption
    }
  }

  const selectCurrentPlaceholder = () => {
    if (!tokenAddress) {
      if (currentType === 'ERC20') {
        return 'Token name or address'
      }
      return 'Choose collection'
    }
    const selectValue = selectCurrentValue()
    if (!selectValue) { return tokenAddress }
    return selectValue.label
  }
  
  return <>
    <Container>
      <WidgetComponent title='Campaign setup'>
        <WidgetSubtitle>Fill in all fields to continue to the next step</WidgetSubtitle>
        <InputStyled
          value={title}
          disabled={Boolean(campaign) || loading}
          placeholder='Enter title'
          onChange={(value: string) => {
            setTitle(value)
            return value
          }}
          title='Title of the campaign'
        />

        <SwitcherStyled
          title='Contract'
          options={[
            {
              title: 'NFTs (ERC721/ERC1155)',
              id: 'nfts',
              loading: userLoading
            },
            {
              title: 'Tokens (ERC20)',
              id: 'tokens',
              loading: userLoading
            }
          ]}
          disabled={Boolean(campaign) || loading || userLoading}
          active={currentSwitcherValue}
          onChange={(id) => {
            setTokenAddress('')
            setCurrentSwitcherValue(id)
            if (id === 'tokens') {
              setCurrentType('ERC20')
            } else {
              setCurrentType(null)
            }
          }}
        />

        <SelectStyled
          disabled={Boolean(campaign) || loading || userLoading}
          onChange={async ({ value }: { value: TNFTContract | string}) => {
            if (typeof value === 'string') {

              if (value === 'create_nft') {
                return history.push('/collections')
              }

              if (currentType === 'ERC20' && chainId) {
                const tokenOwnership = await defineIfUserOwnsContractERC20(address, value, signer)
                if (!tokenOwnership) {
                  return alertError('No tokens of provided contract found')
                }
                setTokenAddress(value)
              } else if (currentType !== 'ERC20' && chainId) {

                // ERC721 / ERC1155
                const tokenType = await defineTokenType(value, signer)
                if (!tokenType) {
                  return alertError('No tokenType provided')
                }
                const tokenOwnership = await defineIfUserOwnsContract(
                  address,
                  value,
                  chainId,
                  signer
                )
                if (!tokenOwnership) {
                  return alertError('No tokens of provided contract found')
                }
                setCurrentType(tokenType)
                setTokenAddress(value)
              } else {
                alertError('No chainId provided')
              }
            } else {
              const contractAddress = String(value.address).toLowerCase()
              const contractSpecificOption = contractSpecificOptions[contractAddress]
              if (contractSpecificOption) {
                setCurrentType(contractSpecificOption.tokenType)
                setTokenAddress(contractAddress)
                return 
              }
  
              const tokenType = String(value.tokenType)

              if (tokenType === 'UNKNOWN') {
                return alertError('Token type is UNKNOWN. Unable to select')
              }
              setCurrentType(tokenType)
              setTokenAddress(contractAddress)
            }
          }}
          placeholder={selectCurrentPlaceholder()}
          value={selectCurrentValue()}
          options={selectTokenOptions}
          notFoundActiveCondition={(value) => {
            return value.startsWith('0x') && value.length === 42
          }}
        />
        <InformationContainer
          id="create_nft_hint"
        >
          💡 Create Soulbound <TextLink to='/collections'>here</TextLink> first if you don’t have it yet
        </InformationContainer>
      </WidgetComponent>

      <Aside
        next={{
          action: () => {
            setInitialData(
              currentType as TTokenType,
              title,
              !Boolean(id),
              () => {
                if (campaign) {
                  return history.push(`/campaigns/edit/${currentType}/${campaign.campaign_id}/initial`)
                }
                history.push(`/campaigns/new/${currentType}/initial`)
              }
            )
          },
          loading,
          disabled: defineIfNextDisabled()
        }}
        back={{
          action: () => {
            history.push(`/campaigns`)
          },
        }}
        title="Summary"
        subtitle="Check and confirm details"
      >
        <AsideContent>
          {title && <TableRow>
            <TableText>Title of campaign</TableText>
            <TableValueShorten>{title}</TableValueShorten>
          </TableRow>}

          {(currentTokenAddress || appliedTokenAddress) && <TableRow>
            <TableText>Token address</TableText>
            <TableValue>{shortenString(String(currentTokenAddressToShow))}</TableValue>
          </TableRow>}

          {(currentTokenSymbol || appliedTokenSymbol) && <TableRow>
            <TableText>Collection</TableText>
            <TableValue>{currentTokenSymbol || appliedTokenSymbol}</TableValue>
          </TableRow>}

          {currentType && <TableRow>
            <TableText>Token standard</TableText>
            <TableValue>{currentType}</TableValue>
          </TableRow>}

          <TableRow>
            <TableText>Network</TableText>
            <TableValue>{defineNetworkName(chainId)}</TableValue>
          </TableRow>
        </AsideContent>
      </Aside>
    </Container>
  </>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsCreateNew)
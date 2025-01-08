import {
  FC,
  useEffect,
  useState
} from 'react'
import {
  TProps
} from './types'
import {
  SwitcherStyled,
  TokensListStyled,
  AsidePopupStyled
} from './styled-components'
import { connect } from 'react-redux'
import { RootState, IAppDispatch } from 'data/store'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { Dispatch } from 'redux'
import * as userAsyncActions from 'data/store/reducers/user/async-actions'
import {
  TNFTContract,
  TERC20Contract,
  TTokenType,
  TCollection,
  TContractListItem
} from 'types'
import { utils } from 'ethers'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'

const mapStateToProps = ({
  user: {
    chainId,
    address,
    contracts,
    contractsERC20,
    loading,
    signer
  },
  collections: {
    collections
  },
  campaign: {
    loading: campaignLoading
  }
}: RootState) => ({
  chainId,
  collections,
  loading,
  address,
  signer,
  contracts,
  contractsERC20,
  campaignLoading
})

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    getContracts: () => {
      dispatch(
        userAsyncActions.getContracts()
      )
    },
    getERC20Contracts: () => {
      dispatch(
        userAsyncActions.getERC20Contracts()
      )
    },
    setContractData: (
      tokenStandard: TTokenType,
      tokenAddress: string,
      callback: () => void
    ) => dispatch(
      campaignAsyncActions.setContractData(
        tokenStandard,
        tokenAddress,
        callback
      )
    ),
  }
}

const defineContractsOptions = (
  contracts: TNFTContract[],
  contractsERC20: TERC20Contract[],
  collections: TCollection[],
  currentSwitcherValue: string | null
) => {
  if (currentSwitcherValue === 'tokens') {
    console.log({
      contractsERC20
    })
    return contractsERC20.map(contract => {
      return {
        title: contract.symbol,
        tokenAddress: contract.address,
        balance: utils.formatUnits(contract.totalBalance as string, contract.decimals),
        type: contract.tokenType,
        image: (contract.image || {}).thumbnailUrl || ''
      }
    })
  }

  if (currentSwitcherValue === 'nfts') {
    return contracts.map(contract => {
      return {
        title: contract.name,
        tokenAddress: contract.address,
        balance: String(contract.totalBalance),
        type: contract.tokenType,
        image: contract.image.thumbnailUrl
      }
    })
  }

  return collections.map(collection => {
    return {
      title: collection.title,
      type: collection.token_standard,
      balance: collection.tokens ? String(collection.tokens.length) : '0',
      image: '',
      tokenAddress: collection.token_address || ''
    }
  })
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const ChooseContractPopup: FC<TProps & ReduxType> = ({
  getContracts,
  getERC20Contracts,
  contracts,
  loading,
  contractsERC20,
  campaignLoading,
  collections,
  setCurrentStep,
  setContractData
}) => {

  const [ currentSwitcherValue, setCurrentSwitcherValue ] = useState<string>('nfts')

  const [
    contract,
    setContract
  ] = useState<TContractListItem | null>()

  useEffect(() => {
    if (currentSwitcherValue === 'nfts') {
      // @ts-ignore
      return getContracts()
    }

    if (currentSwitcherValue === 'tokens') {
      return getERC20Contracts()
    }

  }, [currentSwitcherValue])


  return <AsidePopupStyled
    title='Choose tokens'
    subtitle='Choose tokens tokens you’d like to dispense.'
    // @ts-ignore
    onClose={() => setCurrentStep(null)}

    actionDisabled={!contract}
    action={() => {
      if (!contract) {
        return alert('No contract chosen')
      }
      // @ts-ignore
      setContractData(
        contract.type,
        contract.tokenAddress,
        // currentSwitcherValue === 'sbt',
        () => {
          // @ts-ignore
          setCurrentStep('set_erc20_links')
        }
      )
    }}
  >

    <SwitcherStyled
      title='Contract'
      options={[
        {
          title: 'NFTs',
          id: 'nfts',
          loading
        },
        {
          title: 'Tokens',
          id: 'tokens',
          loading
        },
        {
          title: 'SBTs',
          id: 'sbt',
          loading
        }
      ]}
      disabled={loading || campaignLoading}
      active={currentSwitcherValue}
      onChange={(id) => {
        setCurrentSwitcherValue(id)
      }}
    />

    <TokensListStyled
      contracts={defineContractsOptions(
        contracts,
        contractsERC20,
        collections,
        currentSwitcherValue
      )}
      activeContract={contract?.tokenAddress}
      onSelect={(contract) => {
        setContract(contract)
      }}
    />
  </AsidePopupStyled>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(ChooseContractPopup)
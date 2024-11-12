import {
  FC,
  useEffect,
  useState
} from 'react'
import {
  TProps
} from './types'
import {
  SwitcherStyled
} from './styled-components'
import {
  AsidePopup,
  TokensList
} from 'components/common'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { Dispatch } from 'redux'
import * as userAsyncActions from 'data/store/reducers/user/async-actions'
import { TNFTContract, TERC20Contract, TTokenType, TCollection, TContractListItem } from 'types'
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
      isSBT: boolean,
      callback?: () => void
    ) => dispatch(
      campaignAsyncActions.setContractData(
        tokenStandard,
        tokenAddress,
        isSBT,
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
    return contractsERC20.map(contract => {
      return {
        title: contract.symbol,
        tokenAddress: contract.address,
        balance: utils.formatUnits(contract.totalBalance as string, contract.decimals),
        type: contract.tokenType,
        image: contract.image.thumbnailUrl
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
  onClose,
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


  return <AsidePopup
    title='Choose tokens'
    subtitle='Choose tokens tokens you’d like to dispense.'
    onClose={onClose}

    actionDisabled={!contract}
    action={() => {
      if (!contract) {
        return alert('No contract chosen')
      }
      setContractData(
        contract.type,
        contract.tokenAddress,
        currentSwitcherValue === 'sbt',
        () => {}
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

    <TokensList
      contracts={defineContractsOptions(
        contracts,
        contractsERC20,
        collections,
        currentSwitcherValue
      )}
      onSelect={(contract) => {
        setContract(contract)
      }}
    />
  </AsidePopup>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(ChooseContractPopup)
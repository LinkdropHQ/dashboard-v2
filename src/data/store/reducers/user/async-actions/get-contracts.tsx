import { Dispatch } from 'redux'
import * as userActions from 'data/store/reducers/user/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { RootState } from 'data/store'
import { Alchemy, NftFilters } from 'alchemy-sdk'
import { TNFTContract } from 'types'
import { defineAlchemyNetwork, alertError } from 'helpers'
import { getMnemonicCollections } from 'data/api'
import { convertMnemonicContracts } from 'helpers'
import chains from 'configs/chains'
const { REACT_APP_ALCHEMY_API_KEY } = process.env

const getContracts = () => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions>,
    getState: () => RootState
  ) => {
    dispatch(userActions.setLoading(true))
    try {
      const { user: { address, chainId } } = getState()
      if (!chainId) {
        return alertError('chainId is not provided')
      }
      const chainConfig = chains[chainId]
      if (chainConfig && chainConfig.alchemySupport) {
        const network = defineAlchemyNetwork(chainId)

        if (!network) {
          return alert('NO SUPPORT FOR CHAIN')
        }

        const alchemy = new Alchemy({
          apiKey: REACT_APP_ALCHEMY_API_KEY,
          network
        })
  
        const filters = undefined
  
        const { contracts } = await alchemy.nft.getContractsForOwner(address, filters)

        // @ts-ignore
        dispatch(userActions.setContracts(contracts as TNFTContract[]))
      } else if (chainConfig.mnemonicSupport) {
        const response = await getMnemonicCollections(
          chainId,
          address
        )
        if (response) {
          const { data: { nfts } } = response
          const contracts = convertMnemonicContracts(nfts)
          dispatch(userActions.setContracts(contracts as TNFTContract[]))
        }
      }
      
    } catch (err) {
      alertError('Check console for more information')
      console.error({ err })
    }
    dispatch(userActions.setLoading(false))
  }
}

export default getContracts

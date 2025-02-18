import { Dispatch } from 'redux'
import * as userActions from 'data/store/reducers/user/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { RootState } from 'data/store'
import { Alchemy } from 'alchemy-sdk'
import { TERC20Contract } from 'types'
import {
  defineAlchemyNetwork,
  alertError,
  defineNetworkName,
  truncate
} from 'helpers'
import { BigNumber, ethers } from 'ethers5'
import { zerionApi } from 'data/api'

const { REACT_APP_ALCHEMY_API_KEY } = process.env

const getERC20Contracts = () => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions>,
    getState: () => RootState
  ) => {
    dispatch(userActions.setLoading(true))

    try {
      const { user: { address, chainId, tokenListERC20 } } = getState()
      if (!chainId) {
        return alertError('chainId is not provided')
      }


      if (chainId === 8453) {
        const currentNetworkName = defineNetworkName(chainId)
        const networks = await zerionApi.getNetworks()
        if (networks.data.data.find(item => item.id === currentNetworkName)) {
          const zerionItems = await zerionApi.getERC20Item(
            address,
            currentNetworkName
          )
    
          const zerionData = zerionItems.data.data
    
          if (zerionData.length > 0) {
            const dataConverted = zerionData.map(item => {
              const decimals = item.attributes.quantity.decimals
              const quantity = item.attributes.quantity.int
              const symbol = item.attributes.fungible_info.symbol
              const icon = (item.attributes.fungible_info.icon || {}).url

              const implementation = item.attributes.fungible_info.implementations.find(impl => impl.chain_id === currentNetworkName)
              const address = (implementation || {}).address
              if (!address) {
                return undefined
              }
              return {
                totalBalance: quantity,
                decimals,
                symbol,
                address,
                tokenType: 'ERC20',
              }
    
            }).filter(item => item)
            dispatch(userActions.setContractsERC20(dataConverted as TERC20Contract[]))
          }
        }
      } else {
        const network = defineAlchemyNetwork(chainId)
        if (network) {
          const alchemy = new Alchemy({
            apiKey: REACT_APP_ALCHEMY_API_KEY,
            network
          })
          const { tokenBalances } = await alchemy.core.getTokenBalances(address)


          if (tokenBalances && tokenBalances.length > 0) {
            const contractsWithMetadata: TERC20Contract[] = []
            for (let token of tokenBalances) {
              if (token.tokenBalance && parseInt(token.tokenBalance, 16) === 0) {
                continue
              }
              // commented for now, possible to use later
              // const contractInstance = await new ethers.Contract(token.contractAddress, ERC20Contract.abi, signer)
              // const decimals = await contractInstance.decimals()
              // const symbol = await contractInstance.symbol()
  
              
              // const tokenWithMetadata: TERC20Contract = {
              //   address: token.contractAddress,
              //   totalBalance: !token.tokenBalance ? '0' : String(
              //     ethers.utils.formatUnits(
              //       BigNumber.from(
              //         token.tokenBalance.toString()
              //       ).toString(),
              //       decimals
              //     )
              //   ),
              //   tokenType: 'ERC20',
              //   symbol
              // }

  
              if (!tokenListERC20) {
                continue
              }

              const contractAddress = token.contractAddress.toLocaleLowerCase()
              const tokenListInstance = tokenListERC20[contractAddress]

              if (!tokenListInstance) {
                // const contractInstance = new ethers.Contract(contractAddress, ERC20Contract.abi, signer)
                // const tokenWithMetadata: TERC20Contract = {
                //   address: token.contractAddress,
                //   tokenType: 'ERC20',
                //   totalBalance: !token.tokenBalance ? '0' : String(
                //     BigNumber.from(
                //       token.tokenBalance.toString()
                //     ).toString(),
                //   ),
                //   symbol: await contractInstance.symbol(),
                //   decimals: await contractInstance.decimals()
                // }
                // contractsWithMetadata.push(tokenWithMetadata)
                continue
              }

  
              const tokenWithMetadata: TERC20Contract = {
                address: token.contractAddress,
                tokenType: 'ERC20',
                totalBalance: !token.tokenBalance ? '0' : String(
                  BigNumber.from(
                    token.tokenBalance.toString()
                  ).toString(),
                ),
                symbol: tokenListInstance.symbol,
                decimals: tokenListInstance.decimals
              }
              
              contractsWithMetadata.push(tokenWithMetadata)
            }
            dispatch(userActions.setContractsERC20(contractsWithMetadata as TERC20Contract[]))
          }
        }
      }
      
    } catch (err) {
      alertError('Check console for more information')
      console.error({ err })
    }
    dispatch(userActions.setLoading(false))
  }
}

export default getERC20Contracts

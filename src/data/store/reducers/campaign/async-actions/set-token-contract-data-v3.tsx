import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { TTokenType } from 'types'
import { ERC20Contract, ERC721Contract, ERC1155Contract } from 'abi'
import { BigNumber, ethers } from 'ethers'
import { NATIVE_TOKEN_ADDRESS } from 'configs/app'
import * as userAsyncActions from '../../user/async-actions'
import { RootState, IAppDispatch } from 'data/store'
import { alertError } from 'helpers'
import * as userActions from '../../user/actions'
import {
  defineNativeTokenSymbol
} from 'helpers'

function setTokenContractData (
  tokenAddress: string,
  type: TTokenType,
) {
  // @ts-ignore
  return async (
    dispatch: Dispatch<CampaignActions> & Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    if (!tokenAddress || tokenAddress.length !== 42) {
      dispatch(actionsCampaign.setTokenAddress(null))
      dispatch(actionsCampaign.setDecimals(null))
      dispatch(actionsCampaign.setSymbol(null))
      return
    }

    const {
      user: {
        chainId,
        address,
        signer,
        contractsERC20
      }
    } = getState()
    try {
      dispatch(actionsCampaign.setLoading(true))
      dispatch(actionsCampaign.setTokenAddress(tokenAddress))
      dispatch(actionsCampaign.setLoading(true))
      
      if (type.toUpperCase() === 'ERC20') {
        let decimals = 18
        let symbol = defineNativeTokenSymbol({ chainId })
        if (tokenAddress === NATIVE_TOKEN_ADDRESS) {
          return alert('Cannot create links for native tokens')
        } else {
          const contractInstance = new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
          const token = contractsERC20.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase())
          if (token) {
            decimals = token.decimals
            symbol = token.symbol
            dispatch(userActions.setTokenAmount(BigNumber.from(token.totalBalance)))
          } else {
            decimals = await contractInstance.decimals()
            symbol = await contractInstance.symbol()
            userAsyncActions.getTokenAmount(
              dispatch,
              address,
              decimals,
              contractInstance
            )
          }

        }
        
        dispatch(actionsCampaign.setDecimals(decimals))
        dispatch(actionsCampaign.setSymbol(symbol))
      }
      if (type.toUpperCase() === 'ERC721') {
        const contractInstance = new ethers.Contract(tokenAddress, ERC721Contract.abi, signer)
        
        try {
          const symbol = await contractInstance.name()
          dispatch(actionsCampaign.setSymbol(symbol))
        } catch (e) {
          console.log({ e })
          dispatch(actionsCampaign.setSymbol('ERC721 Token'))
        }
        dispatch(actionsCampaign.setDecimals(0))
      }
  
      if (type.toUpperCase() === 'ERC1155') {
        const contractInstance = new ethers.Contract(tokenAddress, ERC1155Contract.abi, signer)
        try {
          const symbol = await contractInstance.name()
          dispatch(actionsCampaign.setSymbol(symbol))
        } catch (e) {
          console.log({ e })
          dispatch(actionsCampaign.setSymbol('ERC1155 Token'))
        }
        dispatch(actionsCampaign.setDecimals(0))
      }
      dispatch(actionsCampaign.setLoading(false))
    } catch (err) {
      console.error(err)
      dispatch(actionsCampaign.setLoading(false))
      dispatch(actionsCampaign.setDecimals(null))
      dispatch(actionsCampaign.setSymbol(null))
      alertError('Please check token address')
    }
  }
}

export default setTokenContractData

import { Dispatch } from 'redux';
import * as actionsCampaign from '../actions';
import { CampaignActions } from '../types';
import { TTokenType } from 'types'
import { ERC20Contract, ERC721Contract, ERC1155Contract } from 'abi'
import { ethers } from 'ethers'
import { NATIVE_TOKEN_ADDRESS } from 'configs/app'
import { UserActions } from '../../user/types'
import * as userAsyncActions from '../../user/async-actions'

import {
  defineNativeTokenSymbol
} from 'helpers'
import TClaimPattern from 'types/claim-pattern';
// type TIPFSResponse = { data: { IpfsHash: string, PinSize: number, Timestamp: string } }

async function setTokenContractData (
  dispatch: Dispatch<CampaignActions | UserActions>,
  tokenAddress: string,
  provider: any,
  type: TTokenType,
  address: string,
  chainId: number,
  claimPattern: TClaimPattern
) {
  if (!tokenAddress || tokenAddress.length !== 42) {
    dispatch(actionsCampaign.setTokenAddress(null))
    dispatch(actionsCampaign.setDecimals(null))
    dispatch(actionsCampaign.setSymbol(null))
    return
  }
  try {
    dispatch(actionsCampaign.setLoading(true))
    dispatch(actionsCampaign.setTokenAddress(tokenAddress))
    const signer = await provider.getSigner()
    dispatch(actionsCampaign.setLoading(true))
    if (type.toUpperCase() === 'ERC20') {
      let decimals = 18
      let symbol = defineNativeTokenSymbol({ chainId })
      if (tokenAddress === NATIVE_TOKEN_ADDRESS) {

      } else {
        const contractInstance = await new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
        decimals = await contractInstance.decimals()
        symbol = await contractInstance.symbol()
        
        await userAsyncActions.getTokenAmount(
          dispatch,
          address,
          decimals,
          contractInstance
        )
      }
      
      dispatch(actionsCampaign.setDecimals(decimals))
      dispatch(actionsCampaign.setSymbol(symbol))
    }
    if (type.toUpperCase() === 'ERC721') {
      const contractInstance = await new ethers.Contract(tokenAddress, ERC721Contract.abi, signer)
      if (claimPattern === 'transfer') {
        try {
          const hasTokens = await contractInstance.balanceOf(address)
          if (String(hasTokens) === '0') {
            alert('You don’t own any of the tokens from the contract. Please enter the contract address for items that you own.')
            return dispatch(actionsCampaign.setLoading(false))
          }
        } catch (e) {
          console.log('Method balanceOf doesnt work with provided contract')
        }
      }
      
      const symbol = await contractInstance.symbol()
      dispatch(actionsCampaign.setSymbol(symbol))
    }
    if (type.toUpperCase() === 'ERC1155') {
      const contractInstance = await new ethers.Contract(tokenAddress, ERC1155Contract.abi, signer)
      if (claimPattern === 'transfer') {
        try {
          const hasTokens = await contractInstance.balanceOf(address)
          if (String(hasTokens) === '0') {
            alert('You don’t own any of the tokens from the contract. Please enter the contract address for items that you own.')
            return dispatch(actionsCampaign.setLoading(false))
          }
        } catch (e) {
          console.log('Method balanceOf doesnt work with provided contract')
        }
      }

      // const symbol = await contractInstance.symbol()
      dispatch(actionsCampaign.setSymbol('ERC1155'))
    }
    dispatch(actionsCampaign.setLoading(false))
  } catch (err) {
    console.error(err)
    dispatch(actionsCampaign.setLoading(false))
    dispatch(actionsCampaign.setDecimals(null))
    dispatch(actionsCampaign.setSymbol(null))
    alert('Make sure that you are the contract owner and that you are connected to the correct Network')
  }
}

export default setTokenContractData

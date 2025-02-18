import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { ethers } from 'ethers5'
import { RootState } from 'data/store';
import { ERC721Contract, ERC1155Contract } from 'abi'
import { alertError } from 'helpers'

const checkIfApproved = () => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions>,
    getState: () => RootState
  ) => {
    dispatch(campaignActions.setApproved(null))
    const {
      user: {
        signer,
        address
      },
      campaign: {
        tokenAddress,
        tokenStandard,
        proxyContractAddress
      }
    } = getState()
    try {
      if (!tokenAddress) {
        return alertError('No token address provided')
      }
      if (!address) {
        return alertError('No user address provided')
      }
      
      const contractABI = tokenStandard === 'ERC1155' ? ERC1155Contract : ERC721Contract
      const contractInstance = new ethers.Contract(tokenAddress, contractABI.abi, signer)
      const isApproved: boolean = await contractInstance.isApprovedForAll(address, proxyContractAddress)
      dispatch(campaignActions.setApproved(isApproved))

    } catch (err) {
      alertError('Check console for more information')
      console.log({
        err
      })
    }
  }
}

export default checkIfApproved

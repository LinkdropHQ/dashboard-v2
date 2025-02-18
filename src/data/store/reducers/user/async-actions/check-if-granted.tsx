import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { ethers } from 'ethers5'
import { RootState } from 'data/store'
import { defineContract, alertError } from 'helpers'
import contracts from 'configs/contracts'

const checkIfGranted = () => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions>,
    getState: () => RootState
  ) => {
    dispatch(campaignActions.setApproved(null))
    const {
      user: {
        signer,
        address,
        chainId
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

      if (!tokenStandard) {
        return alertError('No tokenStandard provided')
      }

      if (!address) {
        return alertError('No user address provided')
      }

      if (!chainId) {
        return alertError('No chainId provided')
      }

      const contract = contracts[chainId]
      
      const contractABI = defineContract(tokenStandard)
      const contractInstance = new ethers.Contract(tokenAddress, contractABI.abi, signer)
      const isGranted = await contractInstance.hasRole(contract.minter_role, proxyContractAddress)
      dispatch(campaignActions.setApproved(isGranted))

    } catch (err) {
      alertError('Check console for more information')
      console.log({
        err
      })
    }
  }
}

export default checkIfGranted

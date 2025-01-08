import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { utils, ethers } from 'ethers'
import { IAppDispatch, RootState } from 'data/store'
import { ERC20Contract } from 'abi'
import { TAssetsData, TLinkContent } from 'types'
import { plausibleApi } from 'data/api'
import { defineNetworkName, alertError } from 'helpers'
import * as actionsAsyncCampaigns from '../../../campaigns/async-actions'

const approve = (
  sdk: boolean,
  sponsored: boolean,
  callback?: () => void
) => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    // dispatch(campaignActions.setAssets(assets))
    // dispatch(campaignActions.setSdk(sdk))
    // dispatch(campaignActions.setSponsored(sponsored))
    // dispatch(campaignActions.setAssetsOriginal(assetsOriginal))

    // const {
    //   user: {
    //     signer,
    //     address,
    //     chainId
    //   },
    //   campaign: {
    //     tokenAddress,
    //     symbol,
    //     decimals,
    //     proxyContractAddress,
    //     tokenStandard,
    //     claimPattern
    //   }
    // } = getState()

    // try {
    //   if (!tokenAddress) {
    //     return alertError('No token address provided')
    //   }
    //   if (!assets) {
    //     return alertError('No assets provided')
    //   }
    //   if (!symbol) {
    //     return alertError('No symbol provided')
    //   }
    //   if (decimals === null) {
    //     return alertError('No decimals provided')
    //   }
    //   if (!proxyContractAddress) {
    //     return alertError('No proxy address provided')
    //   }
    //   if (!address) {
    //     return alertError('No user address provided')
    //   }
    //   dispatch(campaignActions.setLoading(true))
    //   dispatch(campaignActions.setClaimPattern('transfer'))
    //   const contractInstance = await new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
    //   let iface = new utils.Interface(ERC20Contract.abi)
    //   const data = await iface.encodeFunctionData('approve', [
    //     proxyContractAddress, ethers.constants.MaxUint256
    //   ])

    //   await signer.sendTransaction({
    //     to: tokenAddress,
    //     from: address,
    //     value: 0,
    //     data: data
    //   })
  
    //   const checkTransaction = async function (): Promise<boolean> {
    //     return new Promise((resolve, reject) => {
    //       const checkInterval = setInterval(async () => {
    //         const allowed = await contractInstance.allowance(address, proxyContractAddress)
    //         if (allowed.eq(ethers.constants.MaxUint256)) {
    //           resolve(true)
    //           clearInterval(checkInterval)
    //         }
    //       }, 3000)
    //     })
    //   }
    //   const finished = await checkTransaction()
    //   if (finished) {
    //     dispatch(campaignActions.setApproved(true))
    //     if (callback) { callback() }
    //   }
    // } catch (err) {
    //   alertError('Check console for more information')
    //   console.log({
    //     err
    //   })
    // }
    // dispatch(campaignActions.setLoading(false))
  }
}

export default approve

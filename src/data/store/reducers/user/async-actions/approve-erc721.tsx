import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../types'
import { sleep } from 'helpers'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { ethers } from 'ethers'
import { IAppDispatch, RootState } from 'data/store'
import { ERC721Contract } from 'abi'
import { TAssetsData, TLinkContent } from 'types'
import { plausibleApi } from 'data/api'
import { defineNetworkName, alertError } from 'helpers'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'

const approve = (
  assets: TAssetsData,
  assetsOriginal: TLinkContent[],
  sdk: boolean,
  sponsored: boolean,
  isNewCampaign: boolean,
  callback?: () => void
) => {
  return async (
    dispatch: Dispatch<UserActions> & Dispatch<CampaignActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    
    dispatch(campaignActions.setAssets(assets))
    dispatch(campaignActions.setSdk(sdk))
    dispatch(campaignActions.setSponsored(sponsored))
    dispatch(campaignActions.setAssetsOriginal(assetsOriginal))
    const {
      user: {
        signer,
        address,
        chainId
      },
      campaign: {
        tokenAddress,
        proxyContractAddress,
        approved,
        tokenStandard,
        claimPattern
      }
    } = getState()

    if (approved) {
      dispatch(campaignActions.setLoading(true))
      await sleep(2000)
      dispatch(campaignActions.setLoading(false))
      if (callback) { callback() }
      return
    }

    try {
      if (!tokenAddress) {
        return alertError('No token address provided')
      }
      if (!assets) {
        return alertError('No assets provided')
      }
      if (!proxyContractAddress) {
        return alertError('No proxy address provided')
      }
      if (!address) {
        return alertError('No user address provided')
      }
      dispatch(campaignActions.setLoading(true))
      const contractInstance = await new ethers.Contract(tokenAddress, ERC721Contract.abi, signer)
      plausibleApi.invokeEvent({
        eventName: 'camp_step3_filled',
        data: {
          network: defineNetworkName(chainId),
          token_type: tokenStandard as string,
          claim_pattern: claimPattern,
          distribution: sdk ? 'sdk' : 'manual',
          sponsorship: sponsored ? 'sponsored' : 'non sponsored'
        }
      })
      await contractInstance.setApprovalForAll(proxyContractAddress, true)
  
      const checkTransaction = async function (): Promise<boolean> {
        return new Promise((resolve, reject) => {
          const checkInterval = setInterval(async () => {
            const isApproved = await contractInstance.isApprovedForAll(address, proxyContractAddress)
            if (isApproved) {
              resolve(true)
              clearInterval(checkInterval)
            }
          }, 3000)
        })
      }
      const finished = await checkTransaction()
      if (finished) {
        plausibleApi.invokeEvent({
          eventName: 'camp_step3_passed',
          data: {
            network: defineNetworkName(chainId),
            token_type: tokenStandard as string,
            claim_pattern: claimPattern,
            distribution: sdk ? 'sdk' : 'manual',
            sponsorship: sponsored ? 'sponsored' : 'non sponsored'
          }
        })
        dispatch(campaignActions.setApproved(true))
        if (callback) { callback() }
      }
    } catch (err) {
      alertError('Check console for more information')
      console.log({
        err
      })
    }
    dispatch(campaignActions.setLoading(false))
  }
}

export default approve

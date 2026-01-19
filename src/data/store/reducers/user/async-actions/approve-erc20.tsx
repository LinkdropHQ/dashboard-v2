import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import {
  defineNetworkName,
  alertError
} from 'helpers'
import { utils, ethers } from 'ethers5'
import { IAppDispatch, RootState } from 'data/store'
import { ERC20Contract } from 'abi'
import { TAssetsData, TLinkContent, TTotalAmount } from 'types'
import { plausibleApi } from 'data/api'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'

const approve = (
  assets: TAssetsData,
  totalAmount: TTotalAmount,
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
        chainId,
        tokenAmount
      },
      campaign: {
        tokenAddress,
        symbol,
        decimals,
        proxyContractAddress,
        tokenStandard,
        claimPattern
      }

    } = getState()

    try {
      if (!tokenAddress) {
        return alertError('No token address provided')
      }
      if (!assets) {
        return alertError('No assets provided')
      }
      if (!symbol) {
        return alertError('No symbol provided')
      }
      if (decimals === null) {
        return alertError('No decimals provided')
      }
      if (!proxyContractAddress) {
        return alertError('No proxy address provided')
      }
      if (!address) {
        return alertError('No user address provided')
      }
      dispatch(campaignActions.setLoading(true))
      dispatch(campaignActions.setClaimPattern('transfer'))
      const contractInstance = new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
      let iface = new utils.Interface(ERC20Contract.abi)

      const amountToApprove = totalAmount.amount
      const amountToApproveFormatted = totalAmount.original_amount

      if (!amountToApprove || !amountToApproveFormatted) {
        dispatch(campaignActions.setLoading(false))
        return alertError(`Cannot define amount of tokens to approve`)
      }

      if (!tokenAmount) {
        dispatch(campaignActions.setLoading(false))
        return alertError(`No tokens to approve`)
      }

      const alreadyAllowed = await contractInstance.allowance(address, proxyContractAddress)
      const totalToImprove = (alreadyAllowed as ethers.BigNumber).add(amountToApprove)

      // if (totalToImprove.gt(tokenAmount)) {
      //   dispatch(campaignActions.setLoading(false))
      //   return alertError(
      //     `Not enough tokens to approve. Current balance: ${utils.formatUnits(tokenAmount, decimals)}, tokens to approve: ${amountToApproveFormatted}`
      //   )
      // }

      let data = iface.encodeFunctionData('approve', [
        proxyContractAddress, String(totalToImprove)
      ])

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

      await signer.sendTransaction({
        to: tokenAddress,
        from: address,
        value: 0,
        data: data
      })
  
      const checkTransaction = async function (): Promise<boolean> {
        return new Promise((resolve) => {
          const checkInterval = setInterval(async () => {
            const allowed = await contractInstance.allowance(address, proxyContractAddress)
            if (allowed.gte(totalToImprove)) {
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
        isNewCampaign && dispatch(actionsAsyncCampaigns.addCampaignToDrafts(
          'secure'
        ))
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

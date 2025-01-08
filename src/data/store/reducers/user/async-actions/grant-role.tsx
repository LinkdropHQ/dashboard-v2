import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { utils, ethers } from 'ethers'
import { IAppDispatch, RootState } from 'data/store'
import contracts from 'configs/contracts'
import { defineContract, alertError } from 'helpers'
import { TAssetsData, TLinkContent } from 'types'
import { sleep, defineNetworkName } from 'helpers'
import { plausibleApi } from 'data/api'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'

const grantRole = (
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
    dispatch(campaignActions.setLoading(true))
    dispatch(campaignActions.setAssets(assets))
    dispatch(campaignActions.setSdk(sdk))
    dispatch(campaignActions.setSponsored(sponsored))
    dispatch(campaignActions.setAssetsOriginal(assetsOriginal))
    const {
      user: {
        address,
        chainId,
        signer
      },
      campaign: {
        tokenAddress,
        proxyContractAddress,
        tokenStandard,
        approved,
        claimPattern
      }
    } = getState()

    if (approved) {
      await sleep(2000)
      dispatch(campaignActions.setLoading(false))
      if (callback) { callback() }
      return
    }

    try {
      if (!tokenAddress) {
        return alertError('No token address provided')
      }

      if (!proxyContractAddress) {
        return alertError('No proxy address provided')
      }

      if (!address) {
        return alertError('No user address provided')
      }

      if (!chainId) {
        return alertError('No chainId provided')
      }

      if (!tokenStandard) {
        return alertError('No tokenStandard provided')
      }

      dispatch(campaignActions.setClaimPattern('mint'))
      // @ts-ignore
      const contract = contracts[chainId]
      const gasPrice = await signer.getGasPrice()
      const oneGwei = utils.parseUnits('1', 'gwei')
      const contractABI = (defineContract(tokenStandard)).abi
      const contractInstance = await new ethers.Contract(tokenAddress, contractABI, signer)
      let iface = new utils.Interface(contractABI)

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

      const data = await iface.encodeFunctionData('grantRole', [
        contract.minter_role, proxyContractAddress
      ])

      await signer.sendTransaction({
        to: tokenAddress,
        gasPrice: gasPrice.add(oneGwei),
        from: address,
        value: 0,
        data: data
      })
  
      const checkTransaction = async function (): Promise<boolean> {
        return new Promise((resolve, reject) => {
          const checkInterval = setInterval(async () => {
            const hasRole = await contractInstance.hasRole(contract.minter_role, proxyContractAddress)
            if (hasRole) {
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
      alertError('The contract does not comply to the claim pattern that you’ve selected (mint at claim). Please read more here: https://linkdrop-docs.notion.site/Mint-pattern-requirements-4d99306c117e416dad9bdcf4f473560e')
      console.error(err)
    }
    dispatch(campaignActions.setLoading(false))
  }
}

export default grantRole

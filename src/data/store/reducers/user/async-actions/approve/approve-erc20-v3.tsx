import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions
} from '../../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import {
  alertError
} from 'helpers'
import { utils, ethers } from 'ethers'
import { IAppDispatch, RootState } from 'data/store'
import { ERC20Contract } from 'abi'
import { TTotalAmountERC20 } from 'types'

const approveERC20V3 = async (
  totalAmount: TTotalAmountERC20,
  proxyContractAddress: string,
  dispatch: Dispatch<UserActions> & Dispatch<CampaignActions> & IAppDispatch,
  getState: () => RootState,
  callback?: () => void
) => {
  const {
    user: {
      signer,
      address,
      tokenAmount
    },
    campaign: {
      tokenAddress,
      symbol,
      decimals
    }

  } = getState()

  try {
    if (!tokenAddress) {
      return alertError('No token address provided')
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

    const amountToApproveFormatted = totalAmount.amount_formatted
    const amountToApprove = totalAmount.amount_original

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

    if (totalToImprove.gt(tokenAmount)) {
      dispatch(campaignActions.setLoading(false))
      return alertError(
        `Not enough tokens to approve. Current balance: ${utils.formatUnits(tokenAmount, decimals)}, tokens to approve: ${amountToApproveFormatted}`
      )
    }

    let data = iface.encodeFunctionData('approve', [
      proxyContractAddress, String(totalToImprove)
    ])

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

export default approveERC20V3

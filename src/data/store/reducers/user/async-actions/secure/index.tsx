import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions,
} from '../../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { utils, ethers, BigNumberish, BigNumber } from 'ethers'
import { RootState } from 'data/store'
import { LinkdropFactory, LinkdropMastercopy } from 'abi'
import contracts from 'configs/contracts'
import { defineNativeTokenSymbol, defineNetworkName, alertError } from 'helpers'
import { plausibleApi } from 'data/api'
import { TTotalAmountERC20 } from 'types'
import * as actionsUser from '../../actions'
import * as actionsAsyncUser from '../../async-actions'

const secure = async (
  totalAmount: TTotalAmountERC20,
  proxyContractAddress: string,
  campaignNumber: string,
  dispatch: Dispatch<UserActions>  & Dispatch<CampaignActions>,
  getState: () => RootState,
  successCallback?: () => void
) => {
  const {
    user: {
      signer,
      address,
      chainId,
      nativeTokenAmount
    },
    campaign: {
      claimPattern
    }
  } = getState()


  dispatch(campaignActions.setLoading(true))
  try {
    if (!chainId) {
      return alertError('No chainId provided')
    }
    alert('1')

    const contract = contracts[chainId]
    dispatch(campaignActions.setLoading(true))
    const newWallet = ethers.Wallet.createRandom()
    const { address: publicKey, privateKey: signerKey } = newWallet
    dispatch(campaignActions.setSignerKey(signerKey))
    dispatch(campaignActions.setSignerAddress(publicKey))
    alert('2')

    const proxyContract = new ethers.Contract(proxyContractAddress, LinkdropMastercopy.abi, signer)
    let iface = new utils.Interface(LinkdropFactory.abi)
    alert('3')
    let data = iface.encodeFunctionData('deployProxyWithSigner', [
      campaignNumber, publicKey, claimPattern === 'mint' ? 1 : 0
    ])
    alert('4')

    let to = contract.factory
    if (totalAmount.wei_amount_formatted.gte(nativeTokenAmount as BigNumberish)) {
      const nativeToken = defineNativeTokenSymbol({ chainId })
      dispatch(campaignActions.setLoading(false))
      return alertError(`Not enough ${nativeToken} on account`)
    }

    await signer.sendTransaction({
      to,
      from: address,
      value: totalAmount.wei_amount_formatted,
      data: data
    })

    const checkTransaction = async function (): Promise<boolean> {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          try {
            const res = await proxyContract.isLinkdropSigner(publicKey)
            if (res) {
              resolve(true)
              clearInterval(checkInterval)
            }
          } catch (err) {
            console.log({ err })
          }
          
        }, 3000)
      })
    }
    const finished = await checkTransaction()
    if (finished) {
      successCallback && successCallback()
    }
    dispatch(campaignActions.setLoading(false))
  } catch (err) {
    console.error({ err })
    dispatch(campaignActions.setLoading(false))
  }
  dispatch(campaignActions.setLoading(false))
  
}
export default secure
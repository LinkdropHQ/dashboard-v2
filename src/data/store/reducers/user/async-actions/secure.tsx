import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import {
  UserActions,
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { utils, ethers, BigNumberish, BigNumber } from 'ethers'
import { RootState } from 'data/store'
import { LinkdropFactory, LinkdropMastercopy } from 'abi'
import contracts from 'configs/contracts'
import { defineNativeTokenSymbol, defineNetworkName, alertError } from 'helpers'
import { plausibleApi } from 'data/api'
import { TCountry } from 'types'
import getCoinbasePaymaster from 'components/application/coinbase-paymaster'
import * as actionsUser from '../actions'
import * as actionsAsyncUser from '../async-actions'
import { encodeFunctionData } from 'viem'

const secure = (
  totalNativeTokensAmountToSecure: BigNumber,
  nativeTokensPerLink: string,
  walletApp: string,
  preferredWalletOn: boolean,
  availableСountries: TCountry[],
  availableCountriesOn: boolean,
  expirationDate: number,
  successCallback?: () => void
) => {

  return async (
    dispatch: Dispatch<UserActions>  & Dispatch<CampaignActions>,
    getState: () => RootState
  ) => {

    const {
      user: {
        signer,
        address,
        chainId,
        provider,
        jsonRPCProvider
      },
      campaign: {
        proxyContractAddress,
        id,
        symbol,
        claimPattern,
        tokenStandard,
        sdk,
        sponsored
      }
    } = getState()

    dispatch(campaignActions.setLoading(true))

    const callback = async (dashboardKey: string) => {
      try {
        if (!proxyContractAddress) {
          return alertError('No proxy address provided')
        }
        if (!symbol) {
          return alertError('No symbol provided')
        }
        if (!chainId) {
          return alertError('No chainId provided')
        }
        const contract = contracts[chainId]
        dispatch(campaignActions.setLoading(true))
        const newWallet = ethers.Wallet.createRandom()
        const { address: publicKey, privateKey } = newWallet
        const factoryContract = new ethers.Contract(contract.factory, LinkdropFactory.abi, signer)
        const isDeployed = await factoryContract.isDeployed(address, id)
        const proxyContract = new ethers.Contract(proxyContractAddress, LinkdropMastercopy.abi, signer)
        plausibleApi.invokeEvent({
          eventName: 'camp_step4_filled',
          data: {
            network: defineNetworkName(chainId),
            token_type: tokenStandard as string,
            claim_pattern: claimPattern,
            distribution: sdk ? 'sdk' : 'manual',
            sponsorship: sponsored ? 'sponsored' : 'non sponsored',
            preferred_wallet: walletApp,
            extra_token: nativeTokensPerLink === '0' ? 'no' : 'yes'
          }
        })

        let finished = false
        
        if (!isDeployed) {
          let iface = new utils.Interface(LinkdropFactory.abi)
          const dataEncoded = encodeFunctionData({
            abi: LinkdropFactory.abi,
            functionName: "deployProxyWithSigner",
            args: [
              id, publicKey, claimPattern === 'mint' ? 1 : 0
            ]
          })
          // const data = iface.encodeFunctionData('deployProxyWithSigner', [
          //   id, publicKey, claimPattern === 'mint' ? 1 : 0
          // ])
          // "Invalid UserOp signature or paymaster signature"
          const smartAccountClient = await getCoinbasePaymaster(
            dataEncoded as `0x${string}`,
            contract.factory as `0x${string}`
          )

          if (smartAccountClient) {
            const {
              userOperation,
              bundlerClient,
              account
            } = smartAccountClient
            console.log('here 1')
            userOperation.signature = await account.signUserOperation(userOperation)
            console.log('here 2')
            const userOpHash = await bundlerClient.sendUserOperation({
              ...userOperation,
            })
            console.log('here 3')
            const receipt = await bundlerClient.waitForUserOperationReceipt({
              hash: userOpHash,
            })
            console.log('here 4')


            console.log({ receipt })
          }

          const checkTransaction = async function (): Promise<boolean> {
            return new Promise((resolve) => {
              const checkInterval = setInterval(async () => {
                try {
                  const res = await proxyContract.isLinkdropSigner(address)
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
    

          finished = await checkTransaction()
        } else {
          let iface = new utils.Interface(LinkdropMastercopy.abi)
          const data = iface.encodeFunctionData('addSigner', [
            publicKey
          ])
          const to = proxyContractAddress
  
          await signer.sendTransaction({
            to,
            from: address,
            value: totalNativeTokensAmountToSecure,
            data: data
          })

          const checkTransaction = async function (): Promise<boolean> {
            return new Promise((resolve) => {
              const checkInterval = setInterval(async () => {
                try {
                  const res = await proxyContract.isLinkdropSigner(address)
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
          finished = await checkTransaction()
        }
        
        if (finished) {
          dispatch(campaignActions.setPreferredWalletOn(preferredWalletOn))
          dispatch(campaignActions.setSecured(true))
          dispatch(campaignActions.setCountriesWhitelist(availableСountries.map(country => country.id)))
          dispatch(campaignActions.setCountriesWhitelistOn(availableCountriesOn))
          dispatch(campaignActions.setExpirationDate(expirationDate))
          dispatch(campaignActions.setNativeTokensPerLink(
            utils.parseEther(
              String(
                nativeTokensPerLink || 0
              )
            )
          ))
          dispatch(campaignActions.setSignerKey(privateKey))
          dispatch(campaignActions.setSignerAddress(publicKey))
          dispatch(campaignActions.setWallet(walletApp))
          successCallback && successCallback()
        }
        dispatch(campaignActions.setLoading(false))
      } catch (err) {
        console.error({ err })
        dispatch(campaignActions.setLoading(false))
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(campaignActions.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return 
    }
    
    callback(dashboardKey)
    dispatch(campaignActions.setLoading(false))
    
  }
}

export default secure
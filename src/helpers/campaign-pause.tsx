import { utils, ethers } from 'ethers5'
import { LinkdropMastercopy } from 'abi'
import defineCampaignStatus from './define-campaign-status'

const campaignPause = async (
  contractAddress: string,
  account: string,
  signer: any
) => {
  let iface = new utils.Interface(LinkdropMastercopy.abi)
  const gasPrice = await signer.getGasPrice()
  const oneGwei = ethers.utils.parseUnits('1', 'gwei')
  const data =  await iface.encodeFunctionData('pause', [])
  const payload = { to: contractAddress, from: account, gasPrice: gasPrice.add(oneGwei), data }
  await signer.sendTransaction(payload)
  const checkTransaction = async function (): Promise<string> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        try {
          const status = await defineCampaignStatus(contractAddress, signer)
          if (status === 'paused') {
            clearInterval(checkInterval)
            resolve('paused')
          }
        } catch (err) {
          console.log({ err })
        }
        
      }, 3000)
    })
  }
  return await checkTransaction()
}
export default campaignPause
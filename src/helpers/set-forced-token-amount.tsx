import { utils, ethers } from 'ethers5'
import { LinkdropMastercopy } from 'abi'
import getForcedTokenAmount from './get-forced-token-amount'

const setForcedTokenAmount = async (
  contractAddress: string,
  account: string,
  signer: any,
  amount: string
) => {
  // Check if the ABI has the setForcedTokenAmount function
  const iface = new utils.Interface(LinkdropMastercopy.abi)
  const functionFragment = iface.functions['setForcedTokenAmount(uint256)']

  if (!functionFragment) {
    throw new Error('Contract ABI does not include setForcedTokenAmount. Please restart the development server to reload the ABI.')
  }

  const gasPrice = await signer.getGasPrice()
  const oneGwei = ethers.utils.parseUnits('1', 'gwei')
  const data = iface.encodeFunctionData('setForcedTokenAmount', [amount])
  const payload = { to: contractAddress, from: account, gasPrice: gasPrice.add(oneGwei), data }

  await signer.sendTransaction(payload)

  const checkTransaction = async function (): Promise<string> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        try {
          const currentAmount = await getForcedTokenAmount(contractAddress, signer)
          if (currentAmount === amount) {
            clearInterval(checkInterval)
            resolve(amount)
          }
        } catch (err) {
          console.log({ err })
        }

      }, 3000)
    })
  }
  return await checkTransaction()
}
export default setForcedTokenAmount

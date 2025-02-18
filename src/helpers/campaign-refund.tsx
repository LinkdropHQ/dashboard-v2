import { utils, ethers } from 'ethers5'
import {  LinkdropMastercopy } from 'abi'
import { defineContractFunds } from 'helpers'

const campaignRefund = async (
  contractAddress: string,
  account: string,
  signer: any,
  provider: any
) => {
  let iface = new utils.Interface(LinkdropMastercopy.abi)
  const gasPrice = await signer.getGasPrice()
  const oneGwei = ethers.utils.parseUnits('1', 'gwei')
  const data =  await iface.encodeFunctionData('withdraw', [])
  const payload = { to: contractAddress, from: account, gasPrice: gasPrice.add(oneGwei), data }

  const transaction = await signer.sendTransaction(payload)

  const checkTransaction = async function (): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        try {
          const amount = await defineContractFunds(contractAddress, provider)
          if (String(amount) === '0') {
            clearInterval(checkInterval)
            resolve(true)
          }
        } catch (err) {
          console.log({ err })
        }
      }, 3000)
    })
  }
  return await checkTransaction()
}
export default campaignRefund
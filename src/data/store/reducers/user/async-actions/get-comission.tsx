import { ethers } from 'ethers5'
import contracts from 'configs/contracts'
import { defineJSONRpcUrl, alertError } from 'helpers'
const { REACT_APP_INFURA_ID } = process.env

const feeManagerABI = [
  "function fee() view returns (uint256)",
  "function isWhitelisted(address) view returns (bool)",
]

const getComission = async (
  chainId: number,
  address: string
) => {
  try {
    if (!REACT_APP_INFURA_ID) {
      return alertError('No REACT_APP_INFURA_ID provided in .env file')
    }
    const JSONRpcUrl = defineJSONRpcUrl({ infuraPk: REACT_APP_INFURA_ID as string, chainId })
    const provider = new ethers.providers.JsonRpcProvider(JSONRpcUrl)
    const feeManagerAddress = contracts[chainId].fee_manager
    const feeManager = new ethers.Contract(feeManagerAddress, feeManagerABI, provider)
    const isWhitelisted = await feeManager.isWhitelisted(address)
    if (isWhitelisted) {
      return {
        whitelisted: true,
        comission: '0'
      }
    } else {
      const fee = await feeManager.fee()
      return {
        whitelisted: false,
        comission: String(ethers.utils.formatUnits(fee, 18))
      }
    }
  } catch (err) {
    alertError('Check console for more information')
    console.log({
      err
    })
  } 
}

export default getComission
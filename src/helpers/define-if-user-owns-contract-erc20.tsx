import { ethers, BigNumber } from 'ethers5'
import { ERC20Contract } from 'abi'

type TDefineIfUserOwnsContractERC20 = (
  userAddress: string,
  tokenAddress: string,
  signer: any
) => Promise<boolean>

const defineIfUserOwnsContractERC20: TDefineIfUserOwnsContractERC20 = async (
  userAddress,
  tokenAddress,
  signer
) => {
  try {
    const contractInstance = new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
    const tokenAmount: BigNumber = await contractInstance.balanceOf(userAddress)
    // const decimals = await contractInstance.decimals()
    return tokenAmount.gt(0)
  } catch (err) {
    console.log({
      err
    })
    return false
  }
}

export default defineIfUserOwnsContractERC20
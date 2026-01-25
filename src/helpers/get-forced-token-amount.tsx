import { ethers } from 'ethers5'
import { LinkdropMastercopy } from 'abi'

const getForcedTokenAmount = async (
  contractAddress: string,
  signer: any,
): Promise<string> => {
  const proxyContract = new ethers.Contract(contractAddress, LinkdropMastercopy.abi, signer)

  // Check if the function exists on this contract version
  if (!proxyContract.forcedTokenAmount) {
    console.log('Contract does not support forcedTokenAmount')
    return '0'
  }

  try {
    const forcedAmount = await proxyContract.forcedTokenAmount()
    return forcedAmount.toString()
  } catch (err: any) {
    // Function might not exist on older contract versions
    if (err.code === 'CALL_EXCEPTION' || err.message?.includes('not a function')) {
      console.log('Contract does not support forcedTokenAmount')
      return '0'
    }
    throw err
  }
}

export default getForcedTokenAmount

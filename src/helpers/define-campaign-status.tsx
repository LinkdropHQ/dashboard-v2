import { ethers } from 'ethers'
import { LinkdropMastercopy } from 'abi'

const defineCampaignStatus = async (
  contractAddress: string,
  signer: any,
) => {
  const proxyContract = await new ethers.Contract(contractAddress, LinkdropMastercopy.abi, signer)
  const isPaused = await proxyContract.paused()
  if (isPaused) {

    return 'paused'
  }
  return 'active'
}
export default defineCampaignStatus
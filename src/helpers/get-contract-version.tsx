import {  ethers } from 'ethers5'
import { LinkdropMastercopy } from 'abi'

type TGetContractVersion = (
  proxyContractAddress: string,
  signer: any
) => Promise<string>

const getContractVersion: TGetContractVersion = async (
  proxyContractAddress,
  signer
) => {
  const proxyContract = await new ethers.Contract(proxyContractAddress, LinkdropMastercopy.abi, signer)
  return String(await proxyContract.version())

}
export default getContractVersion
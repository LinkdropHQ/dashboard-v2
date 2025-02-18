import { ethers } from 'ethers5'

const convertStringToBytes32 = (value: string) => {
  let result = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(value))
  while (result.length < 66) { result += '0'; }
  if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
  return result;
}

export default convertStringToBytes32
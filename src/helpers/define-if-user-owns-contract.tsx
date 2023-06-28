import { Alchemy } from 'alchemy-sdk'
import { defineAlchemyNetwork } from 'helpers'
import { TTokenType } from 'types'
import { ethers } from 'ethers'
import { ERC721Contract, ERC1155Contract } from 'abi'
const { REACT_APP_ALCHEMY_API_KEY } = process.env

type TDefineIfUserOwnsContract = (
  userAddress: string,
  tokenAddress: string,
  chainId: number,
  tokenType: TTokenType,
  signer: any
) => Promise<boolean>

const defineIfUserOwnsContract: TDefineIfUserOwnsContract = async (
  userAddress,
  tokenAddress,
  chainId,
  tokenType,
  signer
) => {
  try {
    const alchemy = new Alchemy({
      apiKey: REACT_APP_ALCHEMY_API_KEY,
      network: defineAlchemyNetwork(chainId)
    })
    const result = await alchemy.nft.verifyNftOwnership(userAddress, tokenAddress)
    // if (mint) { return false }
    return result
  } catch (err) {
    console.log({ tokenType })
    if (tokenType === 'ERC721') {
      const contractInstance = new ethers.Contract(tokenAddress, ERC721Contract.abi, signer)
      const balance = await contractInstance.balanceOf(userAddress)
      if (String(balance) === '0') {
        return false
      }
    } else if (tokenType === 'ERC1155') {
      
    }
    return false
  }
}

export default defineIfUserOwnsContract
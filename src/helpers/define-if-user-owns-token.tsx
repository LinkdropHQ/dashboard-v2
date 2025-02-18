import { TTokenType } from "types"
import { ethers } from 'ethers5'
import { ERC20Contract, ERC721Contract, ERC1155Contract } from 'abi'

type TDefineIfUserOwnsToken = (userAddress: string, tokenType: TTokenType, tokenAddress: string, signer: any, tokenId: string) => Promise<{ owns: boolean, balance: string }>

const defineIfUserOwnsToken: TDefineIfUserOwnsToken = async (
  userAddress,
  tokenType,
  tokenAddress,
  signer,
  tokenId
) => {
  try {

    if (tokenType === 'ERC721') {
      const contractInstance = new ethers.Contract(tokenAddress, ERC721Contract.abi, signer)
      const owner = await contractInstance.ownerOf(tokenId)
      return {
        owns: owner.toLowerCase() === userAddress.toLocaleLowerCase(),
        balance: '1'
      }
    }

    if (tokenType === 'ERC1155') {
      const contractInstance = new ethers.Contract(tokenAddress, ERC1155Contract.abi, signer)
      const balance = await contractInstance.balanceOf(userAddress, tokenId)
      return {
        owns: String(balance) !== '0',
        balance: String(balance)
      }
    }

    const contractInstance = new ethers.Contract(tokenAddress, ERC20Contract.abi, signer)
    const balance = await contractInstance.balanceOf(userAddress)

    return {
      owns: true,
      balance: String(balance)
    }
  } catch (err) {
    console.log({
      err
    })
    return {
      owns: false,
      balance: '0'
    }
  }
  
}

export default defineIfUserOwnsToken
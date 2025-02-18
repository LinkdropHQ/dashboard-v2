import { ethers } from 'ethers5'
import { ERC721Contract, ERC1155Contract } from 'abi'
import { TTokenType } from 'types'
import { contractSpecificOptions } from 'configs/contract-specific-options'

const interfaceIdERC721 = "0x80ac58cd"
const interfaceIdERC1155 = "0xd9b67a26"


type TDefineTokenType = (address: string, provider: any) => Promise<TTokenType | null>

const defineTokenType: TDefineTokenType = async (address, signer) => {
  try {
    const contractSpecificOption = contractSpecificOptions[address.toLowerCase()]
    if (contractSpecificOption) {
      return contractSpecificOption.tokenType
    }

    const contractInstanceERC721 = new ethers.Contract(address, ERC721Contract.abi, signer)
    const isERC721 = await contractInstanceERC721.supportsInterface(interfaceIdERC721)
    if (isERC721) {
      return 'ERC721'
    }
    const contractInstanceERC1155 = new ethers.Contract(address, ERC1155Contract.abi, signer)
    const isERC1155 = await contractInstanceERC1155.supportsInterface(interfaceIdERC1155)
    if (isERC1155) {
      return 'ERC1155'
    }
  } catch (err) {
    return null
  }
  return null
}

export default defineTokenType
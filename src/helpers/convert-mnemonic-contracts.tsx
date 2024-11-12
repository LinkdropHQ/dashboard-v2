import { TMnemonicContract, TNFTContract, TTokenType } from 'types'

type TConvertMnemonicContracts = (mnemonicTokens: TMnemonicContract[]) => TNFTContract[]

const convertMnemonicContracts:TConvertMnemonicContracts = (mnemonicTokens) => {
  const result = mnemonicTokens.reduce<Record<string, TNFTContract>>((sum, item) => {
    const { quantity, nft: {
      contractAddress,
      tokenId,
      type,
      collection: {
        name
      }
    }
  } = item
    const hasBeenAddedBefore = sum[contractAddress]
    if (hasBeenAddedBefore) {
      sum[contractAddress] = {
        ...hasBeenAddedBefore,
        numDistinctTokensOwned: hasBeenAddedBefore.numDistinctTokensOwned + 1,
        totalBalance: hasBeenAddedBefore.totalBalance + Number(quantity)
      }
    } else {
      sum[contractAddress] = {
        address: contractAddress,
        name,
        numDistinctTokensOwned: 1,
        symbol: name,
        title: name,
        tokenId,
        tokenType: type.replace('TYPE_', '') as TTokenType,
        totalBalance: Number(quantity),
        image: {
          thumbnailUrl: ''
        }
      }
    }
    return sum
  }, {})
  return Object.values(result)
}

export default convertMnemonicContracts
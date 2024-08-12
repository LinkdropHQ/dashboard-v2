import { Network } from 'alchemy-sdk'

type TDefineAlchemyNetwork = (
  chainId: number
) => Network | undefined

const defineAlchemyNetwork: TDefineAlchemyNetwork = (
  chainId
) => {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET
    case 137:
      return Network.MATIC_MAINNET
    case 8453:
      return Network.BASE_MAINNET
    default: 
      return
  }
}

export default defineAlchemyNetwork
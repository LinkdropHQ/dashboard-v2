import {
  mainnet,
  polygon,
  base,
  immutableZkEvm,
  xLayer
} from 'wagmi/chains'

const defineWagmiNetwork = (
  chainId: number
) => {
  switch (chainId) {
    case 1:
      return mainnet
    case 137:
      return polygon
    case 8453:
      return base
    case 13371:
      return immutableZkEvm
    case 196:
      return xLayer
    default:
      return base
  }
}

export default defineWagmiNetwork
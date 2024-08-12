const defineNetworkName = (chainId: number | null) : string => {
  switch (chainId) {
    case 1: return 'mainnet'
    case 137: return 'polygon'
    case 8453: return 'base'
    case 13371: return 'immutableZkevm'
    default: return 'mainnet'
  }
}

export default defineNetworkName
const defineNetworkName = (chainId: number | null) : string => {
  switch (chainId) {
    case 1: return 'mainnet'
    case 5: return 'goerli'
    case 4: return 'rinkeby'
    case 100: return 'xdai'
    case 137: return 'matic'
    case 80001: return 'mumbai'
    case 1313161554: return 'aurora'
    default: return 'mainnet'
  }
}

export default defineNetworkName
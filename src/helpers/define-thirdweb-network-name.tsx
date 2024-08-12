const defineThirdwebNetworkName = (chainId: number | null) : string | null => {
  switch (chainId) {
    case 1: return 'ethereum'
    case 137: return 'polygon'
    case 8453: return 'base'
    default:
      return null
  }
}

export default defineThirdwebNetworkName
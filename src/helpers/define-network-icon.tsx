import BaseNetworkIcon from 'images/base-network-icon.png'
import PolygonNetworkIcon from 'images/polygon-network-icon.png'
import MainnetNetworkIcon from 'images/mainnet-network-icon.png'

const defineNetworkIcon = (chainId: number) => {
  switch (chainId) {
    case 1:
      return MainnetNetworkIcon
    case 137:
      return PolygonNetworkIcon
    case 8453:
      return BaseNetworkIcon
    default:
      return MainnetNetworkIcon
  }
}

export default defineNetworkIcon

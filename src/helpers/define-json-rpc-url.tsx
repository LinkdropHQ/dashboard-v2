import defineNetworkName from './define-network-name'
const {
  REACT_APP_JSON_RPC_POLYGON,
  REACT_APP_JSON_RPC_MAINNET,
  REACT_APP_JSON_RPC_BASE,
  REACT_APP_JSON_RPC_IMMUTABLE_ZKEVM
} = process.env

const defineJSONRpcUrl = ({ chainId, infuraPk } : { chainId: number, infuraPk: string }) => {
  const networkName = defineNetworkName(chainId)

  if (networkName === 'polygon') {
    return REACT_APP_JSON_RPC_POLYGON
  } else if (networkName === 'mainnet') {
    return REACT_APP_JSON_RPC_MAINNET
  } else if (networkName === 'base') {
    return REACT_APP_JSON_RPC_BASE
  } else if (networkName === 'immutableZkevm') {
    return REACT_APP_JSON_RPC_IMMUTABLE_ZKEVM
  }
  
  return `https://${networkName}.infura.io/v3/${infuraPk}`
}

export default defineJSONRpcUrl
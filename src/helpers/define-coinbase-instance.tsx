const defineCoinbaseInstance = (
  connectorId: string | null
) => {
  if (window.ethereum && window.ethereum.isCoinbaseWallet) {
    return 'coinbase_extension'
  } else if (connectorId && connectorId === 'coinbaseWalletSDK') {
    return 'coinbase_smart_wallet'
  }
  return false
}

export default defineCoinbaseInstance
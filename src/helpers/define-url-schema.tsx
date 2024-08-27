import {
  COINBASE_CLAIM_URL
} from 'configs/app'

const defineUrlSchema = (
  decryptedClaimCode: string,
  chainId: number,
  claimAppURL: string,
  version: number,
  wallet: string
) => {

  if (wallet === 'coinbase_wallet') {
    const coinbaseLink = COINBASE_CLAIM_URL
      .replace('<CODE>', decryptedClaimCode)
      .replace('<CHAIN_ID>', String(chainId))
      .replace('<VERSION>', String(version))
    return coinbaseLink
  }

  const defaultLink = `${claimAppURL}/#/redeem/${decryptedClaimCode}?src=d`

  return defaultLink
}

export default defineUrlSchema
const defineUrlSchema = (
  decryptedClaimCode: string,
  claimAppURL: string,
) => {
  const defaultLink = `${claimAppURL}/#/redeem/${decryptedClaimCode}?src=d`
  return defaultLink
}

export default defineUrlSchema


// const url = COINBASE_CLAIM_URL
// .replace('<CODE>', decryptedClaimCode)
// .replace('<CHAIN_ID>', String(chainId))
// .replace('<VERSION>', String(version))

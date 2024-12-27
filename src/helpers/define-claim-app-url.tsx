import { addressSpecificOptions } from 'configs/address-specific-options'

const {
  REACT_APP_CLAIM_APP,
  REACT_APP_CLAIM_SSR_APP
} = process.env

const defineClaimAppURL = (
  address: string,
  customClaimHost?: string,
  customClaimHostOn?: boolean,
  ssr?: boolean
) => {
  if (customClaimHost && customClaimHostOn) {
    return customClaimHost
  }
  const addressFormatted = address.toLowerCase()
  const configForAddress = addressSpecificOptions[addressFormatted]
  if (!configForAddress || !configForAddress.claimAppUrl) {
    if (ssr) {
      return REACT_APP_CLAIM_SSR_APP || ''
    }
    return REACT_APP_CLAIM_APP || ''
  }

  return configForAddress.claimAppUrl
}

export default defineClaimAppURL
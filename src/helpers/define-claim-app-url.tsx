import { addressSpecificOptions } from 'configs/address-specific-options'

const {
  REACT_APP_CLAIM_APP
} = process.env

const defineClaimAppURL = (address: string) => {
  const addressFormatted = address.toLowerCase()
  const configForAddress = addressSpecificOptions[addressFormatted]
  if (!configForAddress || !configForAddress.claimAppUrl) {
    return REACT_APP_CLAIM_APP || ''
  }
  return configForAddress.claimAppUrl
}

export default defineClaimAppURL
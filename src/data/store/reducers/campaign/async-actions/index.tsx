import setAssetsData from './set-assets-data'
import generateLinks from './generate-links'
import setInitialData from './set-initial-data'
import applyClaimPattern from './apply-claim-pattern'
import resetCampaign from './reset-campaign'
import getUserNFTs from './get-user-nfts'
import createProxyAddress from './create-proxy-address'
import createNewBatch from './create-new-batch'

// V3
import setContractData from './set-contract-data-v3'
import addERC20Links from './add-erc20-links-v3'
import addQRSetData from './add-qr-set-data'
import addClaimLinksMethod from './add-claim-links-method-v3'
import launch from './launch'
import updateAdditionalSettings from './update-additional-settings'
import updateClaimAppSettings from './update-claim-app-settings'

import setTokenContractData from './set-token-contract-data-v3'
import getCampaignData from './get-campaign-data-v3'

export {
  createProxyAddress,
  getCampaignData,
  launch,
  updateAdditionalSettings,
  updateClaimAppSettings,
  addClaimLinksMethod,
  addQRSetData,
  addERC20Links,
  setContractData,
  createNewBatch,
  setAssetsData,
  setTokenContractData,
  applyClaimPattern,
  generateLinks,
  setInitialData,
  resetCampaign,
  getUserNFTs
}
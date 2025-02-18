import { utils, ethers } from 'ethers5'
import {  LinkdropMastercopy } from 'abi'
import defineCampaignStatus from './define-campaign-status'
import { TNFTToken } from 'types'

const defineLastTokenIdForUser = (
  nfts: TNFTToken[]
) => {
  if (nfts[nfts.length - 1]) return nfts[nfts.length - 1].tokenId
  return '10000'
}
export default defineLastTokenIdForUser
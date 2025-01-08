import { action } from 'typesafe-actions'
import { Constants } from './constants'
import { TTokenType, TAssetsData, TLinkContent, TLink, TClaimPattern, TLaunchStage } from 'types'
import { BigNumber } from 'ethers'
import { CampaignState } from './types'

export function setTokenAddress (tokenAddress: string | null) {
  return action(Constants.CAMPAIGN_SET_TOKEN_ADDRESS, {
    tokenAddress
  })
}

export function setTitle (title: string) {
  return action(Constants.CAMPAIGN_SET_TITLE, {
    title
  })
}

export function setClaimHost (claimHost: string) {
  return action(Constants.CAMPAIGN_SET_CLAIM_HOST, {
    claimHost
  })
}

export function setClaimHostOn (claimHostOn: boolean) {
  return action(Constants.CAMPAIGN_SET_CLAIM_HOST_ON, {
    claimHostOn
  })
}

export function setMultipleClaimsOn (multipleClaimsOn: boolean) {
  return action(Constants.CAMPAIGN_SET_MULTIPLE_CLAIMS_ON, {
    multipleClaimsOn
  })
}

export function setAdditionalWalletsOn (additionalWalletsOn: boolean) {
  return action(Constants.CAMPAIGN_SET_ADDITIONAL_WALLETS_ON, {
    additionalWalletsOn
  })
}



export function setPreferredWalletOn (preferredWalletOn: boolean) {
  return action(Constants.CAMPAIGN_SET_PREFERRED_WALLET_ON, {
    preferredWalletOn
  })
}

export function setCountriesWhitelist (countriesWhitelist: string[]) {
  return action(Constants.CAMPAIGN_SET_COUNTRIES_WHITELIST, {
    countriesWhitelist
  })
}

export function setCountriesWhitelistOn (countriesWhitelistOn: boolean) {
  return action(Constants.CAMPAIGN_SET_COUNTRIES_WHITELIST_ON, {
    countriesWhitelistOn
  })
}

export function setDescription (description: string) {
  return action(Constants.CAMPAIGN_SET_DESCRIPTION, {
    description
  })
}

export function setLogoURL (logoURL: string) {
  return action(Constants.CAMPAIGN_SET_LOGO_URL, {
    logoURL
  })
}

export function setLoading (loading: boolean) {
  return action(Constants.CAMPAIGN_SET_LOADING, {
    loading
  })
}

export function setDropAddress (dropAddress: string) {
  return action(Constants.CAMPAIGN_SET_DROP_ADDRESS, {
    dropAddress
  })
}

export function setTokenStandard (tokenStandard: TTokenType) {
  return action(Constants.CAMPAIGN_SET_TOKEN_STANDARD, {
    tokenStandard
  })
}

export function setDecimals (decimals: number | null) {
  return action(Constants.CAMPAIGN_SET_DECIMALS, {
    decimals
  })
}

export function setAssets (assets: TAssetsData | null) {
  return action(Constants.CAMPAIGN_SET_ASSETS, {
    assets
  })
}

export function setAssetsOriginal (assetsOriginal: TLinkContent[] | null) {
  return action(Constants.CAMPAIGN_SET_ASSETS_ORIGINAL, {
    assetsOriginal
  })
}

export function setSymbol (symbol: string | null) {
  return action(Constants.CAMPAIGN_SET_SYMBOL, {
    symbol
  })
}

export function setWallet (wallet: string | null) {
  return action(Constants.CAMPAIGN_SET_WALLET, {
    wallet
  })
}

export function clearCampaign () {
  return action(Constants.CAMPAIGN_CLEAR)
}

export function setCampaign (campaign: CampaignState) {
  return action(Constants.CAMPAIGN_SET_CAMPAIGN, {
    campaign
  })
}

export function setProxyContractAddress(proxyContractAddress: string | null) {
  return action(Constants.CAMPAIGN_SET_PROXY_CONTRACT_ADDRESS, {
    proxyContractAddress
  })
}

export function setApproved (approved: boolean | null) {
  return action(Constants.CAMPAIGN_SET_APPROVED, {
    approved
  })
}

export function setSecured (secured: boolean) {
  return action(Constants.CAMPAIGN_SET_SECURED, {
    secured
  })
}

export function setSignerKey (signerKey: string) {
  return action(Constants.CAMPAIGN_SET_SIGNER_KEY, {
    signerKey
  })
}

export function setSignerAddress (signerAddress: string) {
  return action(Constants.CAMPAIGN_SET_SIGNER_ADDRESS, {
    signerAddress
  })
}

export function setSponsored (sponsored: boolean) {
  return action(Constants.CAMPAIGN_SET_SPONSORED, {
    sponsored
  })
}


export function setLinks (links: TLink[]) {
  return action(Constants.CAMPAIGN_SET_LINKS, {
    links
  })
}

export function setLaunchStage (launchStage: TLaunchStage) {
  return action(Constants.CAMPAIGN_SET_LAUNCH_STAGE, {
    launchStage
  })
}

export function setId (id: string) {
  return action(Constants.CAMPAIGN_SET_ID, {
    id
  })
}

export function setClaimPattern (claimPattern: TClaimPattern) {
  return action(Constants.CAMPAIGN_SET_CLAIM_PATTERN, {
    claimPattern
  })
}

export function setSdk (sdk: boolean) {
  return action(Constants.CAMPAIGN_SET_SDK, {
    sdk
  })
}

export function setNativeTokensPerLink (nativeTokensPerLink: BigNumber) {
  return action(Constants.CAMPAIGN_SET_NATIVE_TOKENS_PER_LINK, {
    nativeTokensPerLink
  })
}

export function setLinksGenerateLoader (linksGenerateLoader: number) {
  return action(Constants.CAMPAIGN_SET_LINKS_GENERATE_LOADER, {
    linksGenerateLoader
  })
}

export function setExpirationDate (expirationDate: number) {
  return action(Constants.CAMPAIGN_SET_EXPIRATION_DATE, {
    expirationDate
  })
}

export function setCollectionId (collectionId: null | string) {
  return action(Constants.CAMPAIGN_SET_COLLECTION_ID, {
    collectionId
  })
}

export function setCollectionTokenId (collectionTokenId: null | string) {
  return action(Constants.CAMPAIGN_SET_COLLECTION_TOKEN_ID, {
    collectionTokenId
  })
}


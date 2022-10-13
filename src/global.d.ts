declare module '@linkdrop/sdk' {
  interface ISDK {
    linkdropMasterAddress: string,
    factoryAddress: string,
    chain?: string, // = 'mainnet'
    jsonRpcUrl?: string, //  = getJsonRpcUrl(chain)
    apiHost?: string, //  = `https://${chain}.linkdrop.io
    claimHost?: string // 'https://claim.linkdrop.io'
  }

  type TGenerateLinkERC20 = {
    signingKeyOrWallet: string,
    weiAmount: string,
    tokenAddress: string,
    wallet: string,
    tokenAmount: string,
    expirationTime: string,
    campaignId: string
  }

  type TGenerateLinkERC721 = {
    signingKeyOrWallet: string,
    weiAmount: string,
    nftAddress: string,
    wallet: string,
    tokenId: string | number,
    expirationTime: string,
    campaignId: string
  }

  type TGenerateLinkERC1155 = {
    signingKeyOrWallet: string,
    weiAmount: string,
    nftAddress: string,
    wallet: string,
    tokenId: string | number,
    expirationTime: string,
    campaignId: string,
    tokenAmount: string,
  }

  type TLink = {
    url: string,
    linkId: string,
    linkKey: string,
    linkdropSignerSignature: string
  }

  class LinkdropSDK implements ISDK {
    constructor(params: ISDK)
    getProxyAddress: (campaignId: string) => string

    generateLink: ({
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime = 12345678910,
      campaignId,
      wallet
    }: TGenerateLinkERC20) => TLink

    generateLinkERC721: ({
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      campaignId,
      wallet
    }: TGenerateLinkERC721) => TLink

    generateLinkERC1155: ({
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      campaignId,
      wallet,
      tokenAmount
    }: TGenerateLinkERC1155) => TLink
  }
  export = LinkdropSDK
}

declare module 'worker-loader!*' {

  class WebpackWorker extends Worker {
      constructor ()
  }

  export default WebpackWorker;
}

import LinkdropSDK from '@linkdrop/sdk';
import { expose } from 'comlink';
import { TLink, TAssetsData, TTokenType } from 'types'
import { EXPIRATION_DATE } from 'configs/app'
import { encrypt } from 'lib/crypto'

export class MyWebWorker {
  private newLinks: Array<TLink> = [];
  private sdk?: LinkdropSDK | null
  private cb: (value: number) => void;
  private currentPercentageFinished: number = 0;

  public constructor(
    cb: (value: number) => void
  ) {
    this.cb = cb
  }

  private createSDK (
    linkdropMasterAddress: string,
    factoryAddress: string,
    chain: string,
    jsonRpcUrl: string,
    apiHost: string,
    claimHost: string
  ) {
    this.sdk = new LinkdropSDK({
      claimHost,
      factoryAddress,
      chain,
      linkdropMasterAddress,
      jsonRpcUrl,
      apiHost
    })
  }

  private async createERC20Link (
    weiAmount: string,
    tokenAddress: string,
    wallet: string,
    tokenAmount: string,
    expirationTime: string,
    campaignId: string,
    signingKeyOrWallet: string
  ) {
    return await this.sdk?.generateLink({
      weiAmount,
      tokenAddress,
      wallet,
      tokenAmount,
      expirationTime,
      campaignId,
      signingKeyOrWallet
    })
  }

  private async createERC721Link (
    weiAmount: string,
    tokenAddress: string,
    wallet: string,
    tokenId: string,
    expirationTime: string,
    campaignId: string,
    signingKeyOrWallet: string
  ) {
    return await this.sdk?.generateLinkERC721({
      nftAddress: tokenAddress,
      wallet,
      expirationTime,
      campaignId,
      signingKeyOrWallet,
      tokenId,
      weiAmount
    })
  }

  private async createERC1155Link (
    weiAmount: string,
    tokenAddress: string,
    wallet: string,
    tokenId: string,
    tokenAmount: string,
    expirationTime: string,
    campaignId: string,
    signingKeyOrWallet: string
  ) {
    return await this.sdk?.generateLinkERC1155({
      nftAddress: tokenAddress,
      wallet,
      expirationTime,
      campaignId,
      signingKeyOrWallet,
      tokenId,
      tokenAmount,
      weiAmount
    })
  }

  public async generateLink(
    type: TTokenType,
    linkdropMasterAddress: string,
    factoryAddress: string,
    chain: string,
    jsonRpcUrl: string,
    apiHost: string,
    claimHost: string,
    assets: TAssetsData,
    sponsored: boolean,
    tokenAddress: string,
    wallet: string,
    id: string,
    signerKey: string,
    dashboardKey: string
  ) : Promise<any> {
    try {
      this.createSDK(
        linkdropMasterAddress,
        factoryAddress,
        chain,
        jsonRpcUrl,
        apiHost,
        claimHost
      )
      for (let i = 0; i < assets.length; i++) {
        let result
        if (type === 'ERC20') {
          result = await this.createERC20Link(
            assets[i].native_tokens_amount || '0',
            tokenAddress,
            wallet,
            assets[i].amount || '0',
            EXPIRATION_DATE,
            id,
            signerKey
          )
        } else if (type === 'ERC721') {
          result = await this.createERC721Link(
            assets[i].native_tokens_amount || '0',
            tokenAddress,
            wallet,
            String(assets[i].id || '0'),
            EXPIRATION_DATE,
            id,
            signerKey
          )
        } else {
          result = await this.createERC1155Link(
            assets[i].native_tokens_amount || '0',
            tokenAddress,
            wallet,
            String(assets[i].id || '0'),
            assets[i].amount || '0',
            EXPIRATION_DATE,
            id,
            signerKey
          )
        }
        if (result) {
          const newLink = !sponsored ? `${result?.url}&manual=true` : result?.url
          const newLinkEncrypted = encrypt(newLink, dashboardKey)
          this.newLinks = [...this.newLinks, {
            link_id: result?.linkId,
            encrypted_claim_link: newLinkEncrypted
          }]
          const percentageFinished = Math.round(this.newLinks.length / assets.length * 100) / 100
          if (this.currentPercentageFinished < percentageFinished) {
            this.currentPercentageFinished = percentageFinished
            this.cb(this.currentPercentageFinished)
          }
        }
      }
      return this.newLinks
    } catch (e) {
      console.log({ e })
      return new Error('Some error occured')
    }
  }
}

expose(MyWebWorker);
import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import { expose } from 'comlink'
import { TLink, TTokenType } from 'types'
const { REACT_APP_SERVER_URL, REACT_APP_ZUPLO_API_KEY } = process.env

export class LinksWorker {
  private newLinks: Array<TLink> = [];
  private sdk?: LinkdropBatchSDK | null
  private cb: (value: number) => void;
  private currentPercentageFinished: number = 0;
  public constructor(
    cb: (value: number) => void
  ) {
    this.cb = cb
  }
  private createSDK (
    claimHost: string
  ) {
    const sdk = new LinkdropBatchSDK({
      claimHostUrl: claimHost,
      apiHost: REACT_APP_SERVER_URL,
      apiKey: REACT_APP_ZUPLO_API_KEY as string
    })
    this.sdk = sdk
  }

  private async createERC20Link (
    weiAmount: string,
    tokenAddress: string,
    tokenAmount: string,
    expirationTime: string,
    chainId: string | number,
    signingKeyOrWallet: string,
    encryptionKey: string,
    proxyContractAddress: string,
    proxyContractVersion: string
  ) {
    return await this.sdk?.utils.createLink(
      {
        amount: tokenAmount,
        links: '1',
        weiAmount,
        id: 'not defined'
      },
      signingKeyOrWallet,
      encryptionKey,
      'ERC20',
      tokenAddress,
      proxyContractAddress,
      Number(chainId),
      proxyContractVersion,
      expirationTime
    )
  }

  private async createERC721Link (
    weiAmount: string,
    tokenAddress: string,
    tokenId: string,
    expirationTime: string,
    chainId: string | number,
    signingKeyOrWallet: string,
    encryptionKey: string,
    proxyContractAddress: string,
    proxyContractVersion: string
  ) {
    return await this.sdk?.utils.createLink(
      {
        amount: 'not defined',
        links: '1',
        weiAmount,
        id: tokenId
      },
      signingKeyOrWallet,
      encryptionKey,
      'ERC721',
      tokenAddress,
      proxyContractAddress,
      Number(chainId),
      proxyContractVersion,
      expirationTime
    )
  }

  private async createERC1155Link (
    weiAmount: string,
    tokenAddress: string,
    tokenId: string,
    tokenAmount: string,
    expirationTime: string,
    chainId: string | number,
    signingKeyOrWallet: string,
    encryptionKey: string,
    proxyContractAddress: string,
    proxyContractVersion: string
  ) {
    return await this.sdk?.utils.createLink(
      {
        amount: tokenAmount,
        links: '1',
        weiAmount,
        id: tokenId
      },
      signingKeyOrWallet,
      encryptionKey,
      'ERC1155',
      tokenAddress,
      proxyContractAddress,
      Number(chainId),
      proxyContractVersion,
      expirationTime
    )
  }
  public async generateLink(
    type: TTokenType,
    linkdropMasterAddress: string,
    chainId: string | number,
    links: TLink[],
    tokenAddress: string,
    signerKey: string,
    dashboardKey: string,
    proxyContractAddress: string,
    proxyContractVersion: string
  ) : Promise<any> {

    try {
      this.createSDK(
        linkdropMasterAddress
      )
      for (let i = 0; i < links.length; i++) {
        console.log({
          link: links[i]
        })
        let result
        if (type === 'ERC20') {
          result = await this.createERC20Link(
            links[i].wei_amount || '0',
            tokenAddress,
            links[i].token_amount || '0',
            links[i].expiration_time,
            chainId,
            signerKey,
            dashboardKey,
            proxyContractAddress,
            proxyContractVersion,
          )
        } else if (type === 'ERC721') {
          result = await this.createERC721Link(
            links[i].wei_amount || '0',
            tokenAddress,
            String(links[i].token_id || '0'),
            links[i].expiration_time,
            chainId,
            signerKey,
            dashboardKey,
            proxyContractAddress,
            proxyContractVersion
          )

        } else {
          result = await this.createERC1155Link(
            links[i].wei_amount || '0',
            tokenAddress,
            String(links[i].token_id || '0'),
            links[i].token_amount || '0',
            links[i].expiration_time,
            chainId,
            signerKey,
            dashboardKey,
            proxyContractAddress,
            proxyContractVersion
          )
        }
        if (result) {
          const linkData = {
            encrypted_claim_code: result.encrypted_claim_code,
            token_id: String(links[i].token_id || '0'),
            token_amount: links[i].token_amount || '0',
            link_id: result.link_id,
            _id: links[i]._id,
            sender_signature: result.sender_signature,
            expiration_time: links[i].expiration_time,
            wei_amount: links[i].wei_amount || '0',
          }
          
          this.newLinks = [...this.newLinks, linkData]
          const percentageFinished = Math.round(this.newLinks.length / links.length * 100) / 100
          if (this.currentPercentageFinished < percentageFinished) {
            this.currentPercentageFinished = percentageFinished
            this.cb(this.currentPercentageFinished)
          }
        }
      }
      console.log('this.newLinks', this.newLinks)
      return this.newLinks
    } catch (e) {
      console.log({ e })
      return new Error('Some error occured')
    }
  }
}

expose(LinksWorker)
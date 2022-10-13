import LinkdropSDK from '@linkdrop/sdk';
import { expose } from 'comlink';
import { TLink, TAssetsData } from 'types'
import { EXPIRATION_DATE } from 'configs/app'
import { encrypt } from 'lib/crypto'
import { sleep } from 'helpers'

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

  public async getData(
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
      this.sdk = new LinkdropSDK({
        claimHost,
        factoryAddress,
        chain,
        linkdropMasterAddress,
        jsonRpcUrl,
        apiHost
      })
      for (let i = 0; i < assets.length; i++) {
        const result = await this.sdk?.generateLink({
          weiAmount: assets[i].native_tokens_amount || '0',
          tokenAddress,
          wallet,
          tokenAmount: assets[i].amount || '0',
          expirationTime: EXPIRATION_DATE,
          campaignId: id,
          signingKeyOrWallet: signerKey
        })
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
import { expose } from 'comlink';
import { TQRItem, TLinkDecrypted } from 'types'
import * as wccrypto from '@walletconnect/utils/dist/esm'
import { ethers } from 'ethers'
import { decrypt, encrypt } from 'lib/crypto'


export class QRsWorker {
  private cb: (value: number) => void;
  private currentPercentageFinished: number = 0;

  public constructor(
    cb: (value: number) => void
  ) {
    this.cb = cb
  }

  public prepareQRs (
    quantity: number,
    dashboard_key: string
  ) {
    console.log('prepare qrs start')
    const qrArray: TQRItem[] = []
    for (let i = 0; i < quantity; i++) {
      const newWallet = wccrypto.generateKeyPair()
      const { privateKey } = newWallet
      const qrId = new ethers.Wallet(privateKey).address
      const qr = {
        encrypted_qr_secret: encrypt(privateKey, dashboard_key),
        qr_id: qrId
      }
      qrArray.push(qr)
      const percentageFinished = Math.round(qrArray.length / quantity * 100) / 100
      if (this.currentPercentageFinished < percentageFinished) {
        this.currentPercentageFinished = percentageFinished
        this.cb(this.currentPercentageFinished)
      }
    }
    this.currentPercentageFinished = 0
    return qrArray
  }

  public async downloadQRs (

  ) {

  }

  public mapQrsWithLinks (
    qrs: TQRItem[],
    links: TLinkDecrypted[],
    dashboard_key: string
  ) {
    const qrArray: TQRItem[] = qrs
    for (let i = 0; i < qrArray.length; i++) {
      const decrypted_qr_secret = decrypt(qrArray[i].encrypted_qr_secret, dashboard_key)
      const claim_link = links[i].claim_link
      qrArray[i].encrypted_claim_link = encrypt(claim_link, decrypted_qr_secret)
      qrArray[i].claim_link_id = links[i].link_id
      const percentageFinished = Math.round(i / qrArray.length * 100) / 100
      if (this.currentPercentageFinished < percentageFinished) {
        this.currentPercentageFinished = percentageFinished
        this.cb(this.currentPercentageFinished)
      }
    }
    this.currentPercentageFinished = 0
    return qrArray
  }
}

expose(QRsWorker)
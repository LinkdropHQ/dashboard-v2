/* gobal OffscreenCanvas */
import { expose } from 'comlink'
import { TQRItem, TQROption, TLinkDecrypted, TQRImageOptions } from 'types'
import * as wccrypto from '@walletconnect/utils/dist/esm'
import { ethers } from 'ethers'
import { decrypt, encrypt } from 'lib/crypto'
import QRCodeStyling from 'qr-code-styling-bigmac'

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
    qrsArray: TQRItem[],
    width: number,
    height: number,
    dashboardKey: string,
    logoImageWidth: number,
    logoImageHeight: number,
    img: ImageBitmap,
    qrOption: TQROption,
    claimAppUrl?: string
  ) {

    console.log({ qrOption })
    let qrs: Blob[] = []
    for (let i = 0; i < qrsArray.length; i++) {
      const decrypted_qr_secret = decrypt(qrsArray[i].encrypted_qr_secret, dashboardKey)
      const qrCode = new QRCodeStyling({
        data: `${claimAppUrl}/#/qr/${decrypted_qr_secret}`,
        width,
        height,
        margin: width / 60,
        type: 'canvas',
        cornersSquareOptions: qrOption.cornersSquareOptions,
        cornersDotOptions: qrOption.cornersDotOptions,
        dotsOptions: qrOption.dotsOptions,
        backgroundOptions: qrOption.backgroundOptions,
        image: img,
        imageOptions: qrOption.imageOptions,
        logoImageWidth,
        logoImageHeight
      })
  
      const blob = await qrCode.getRawData('png')
      if (!blob) { continue }
      qrs.push(blob)
      const percentageFinished = Math.round(i / qrsArray.length * 100) / 100
      if (this.currentPercentageFinished < percentageFinished) {
        this.currentPercentageFinished = percentageFinished
        this.cb(this.currentPercentageFinished)
      }
    }
    return qrs
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
import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip } from 'helpers'
import { TQRItem } from "types"
import {  TQROption, TLinkDecrypted, TQRImageOptions } from 'types'
import { decrypt, encrypt } from 'lib/crypto'
import QRCodeStyling from 'qr-code-styling'

import {
  sleep,
  loadImage,
  createDataGroups,
  createWorkers,
  terminateWorkers
} from 'helpers'
import { Remote } from 'comlink';
import { QRsWorker } from 'web-workers/qrs-worker'
import qrOptions from 'configs/qr-options'

const {
  REACT_APP_CLAIM_APP,
  REACT_APP_QR_OPTIONS
} = process.env

const downloadQRs = ({
  qrsArray,
  qrSetName,
  width,
  height,
  callback
}: {
  qrsArray: TQRItem[],
  qrSetName: string,
  width: number,
  height: number,
  callback?: () => void
}) => {
  return async (
    dispatch: Dispatch<QRsActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsQR.setLoading(true))
    const { user: { dashboardKey, workersCount } } = getState()
    let currentPercentage = 0
    try {
      const neededWorkersCount = qrsArray.length <= 1000 ? 1 : workersCount
      if (!dashboardKey) { return alert('dashboardKey is not provided') }
      if (!qrsArray) { return alert('qrsArray is not provided') }
      const start = +(new Date())
      
      const updateProgressbar = async (value: number) => {
        console.log({ value })
        if (value === currentPercentage || value < currentPercentage) { return }
        currentPercentage = value
        dispatch(actionsQR.setDownloadLoader(currentPercentage))
        sleep(1)
      }

      const qrOption = qrOptions[REACT_APP_QR_OPTIONS || 'ledger']

      const resp = await fetch(qrOption.icon)
      const blob = await resp.blob()
      const img = await createImageBitmap(blob as ImageBitmapSource)


      const logoImageLoaded = await loadImage(
        qrOption.imageOptions,
        qrOption.icon
      )



      




      const result = await createQRs(
        qrsArray,
        width, // qr width
        height, // qr height
        dashboardKey,
        logoImageLoaded.width,
        logoImageLoaded.height,
        img, // image bitmap to render in canvas
        qrOption,
        updateProgressbar,
        REACT_APP_CLAIM_APP,
      )

      console.log((+ new Date()) - start)

      console.log(`started download of 1 part of result`)
      await downloadBase64FilesAsZip('png', result, `${qrSetName}-1`, 0)
      console.log(`finished download of 1 part of result`)
  
  
      currentPercentage = 0
      dispatch(actionsQR.setDownloadLoader(0))
      callback && callback()
    } catch (err) {
      currentPercentage = 0
      dispatch(actionsQR.setDownloadLoader(0))
      callback && callback()
      alert('Some error occured, check console for more information')
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

const createQRs = async (
  qrsArray: TQRItem[],
  width: number,
  height: number,
  dashboardKey: string,
  logoImageWidth: number,
  logoImageHeight: number,
  img: ImageBitmap,
  qrOption: TQROption,
  updateProgressbar: any,
  claimAppUrl?: string
) => {

  console.log({ qrOption })
  let qrs: Blob[] = []
  for (let i = 0; i < qrsArray.length; i++) {
    const decrypted_qr_secret = decrypt(qrsArray[i].encrypted_qr_secret, dashboardKey)
    const qrCode = new QRCodeStyling({
      data: `${claimAppUrl}/#/qr/${decrypted_qr_secret}`,
      width,
      height,
      margin: width / 60,
      type: 'svg',
      cornersSquareOptions: qrOption.cornersSquareOptions,
      cornersDotOptions: qrOption.cornersDotOptions,
      backgroundOptions: qrOption.backgroundOptions,
      imageOptions: qrOption.imageOptions
    })
    // const qrCode = new QRCodeStyling({
    //   data: `${claimAppUrl}/#/qr/${decrypted_qr_secret}`,
    //   width,
    //   height,
    //   margin: width / 60,
    //   type: 'canvas',
    //   cornersSquareOptions: qrOption.cornersSquareOptions,
    //   cornersDotOptions: qrOption.cornersDotOptions,
    //   dotsOptions: qrOption.dotsOptions,
    //   backgroundOptions: qrOption.backgroundOptions,
    //   image: img,
    //   imageOptions: qrOption.imageOptions,
    //   logoImageWidth,
    //   logoImageHeight
    // })

    const blob = await qrCode.getRawData('png')
    if (!blob) { continue }
    qrs.push(blob)
    const percentageFinished = Math.round(i / qrsArray.length * 100) / 100
    updateProgressbar(percentageFinished)
  }
  return qrs
}

export default downloadQRs
import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip } from 'helpers'
import { TQRItem } from "types"
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink';
import { sleep, loadImage } from 'helpers'
import LedgerIcon from 'images/ledger-logo.png'

const {
  REACT_APP_CLAIM_APP
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
    dispatch(actionsQR.setDownloadItems([]))
    const { user: { dashboardKey } } = getState()
    try {
      if (!dashboardKey) { return alert('dashboardKey is not provided') }
      if (!qrsArray) { return alert('qrsArray is not provided') }
      const start = +(new Date())

      const updateProgressbar = async (value: number) => {
        dispatch(actionsQR.setDownloadLoader(value))
        await sleep(1)
      }

      const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
      const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar))
      const resp = await fetch(LedgerIcon)
      const blob = await resp.blob()
      const img = await createImageBitmap(blob as ImageBitmapSource)
      const qrImageOptions = {
        margin: 1,
        imageSize: 0.5,
        crossOrigin: 'anonymous',
      }
      const logoImageLoaded = await loadImage(
        qrImageOptions,
        LedgerIcon
      )

      const qrs = await qrsWorker.downloadQRs(
        qrsArray, // data to create qrs
        width, // qr width
        height, // qr height
        dashboardKey,
        qrImageOptions,
        logoImageLoaded.width,
        logoImageLoaded.height,
        img, // image bitmap to render in canvas
        REACT_APP_CLAIM_APP
      )
      console.log((+ new Date()) - start)

      downloadBase64FilesAsZip('png', qrs, qrSetName)
      dispatch(actionsQR.setDownloadItems([]))
      callback && callback()
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default downloadQRs
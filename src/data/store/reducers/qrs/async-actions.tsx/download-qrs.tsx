import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip } from 'helpers'
import { TQRItem } from "types"
import {
  sleep,
  loadImage,
  createDataGroups,
  createWorkers,
  terminateWorkers
} from 'helpers'
import LedgerIcon from 'images/ledger-logo.png'
import { Remote } from 'comlink';
import { QRsWorker } from 'web-workers/qrs-worker'

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
    const { user: { dashboardKey, workersCount } } = getState()
    let currentPercentage = 0
    try {
      const neededWorkersCount = qrsArray.length <= 1000 ? 1 : workersCount
      if (!dashboardKey) { return alert('dashboardKey is not provided') }
      if (!qrsArray) { return alert('qrsArray is not provided') }
      const start = +(new Date())
      
      const updateProgressbar = async (value: number) => {
        if (value === currentPercentage || value < currentPercentage) { return }
        currentPercentage = value
        dispatch(actionsQR.setDownloadLoader(currentPercentage))
        await sleep(1)
      }

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

      const linkGroups = createDataGroups(qrsArray, neededWorkersCount)
      console.log({ linkGroups })
      const workers = await createWorkers(linkGroups, 'qrs', updateProgressbar)
      console.log({ workers })
      const result = await Promise.all(workers.map(({
        worker,
        data
      }) => (worker as Remote<QRsWorker>).downloadQRs(
        data,
        width, // qr width
        height, // qr height
        dashboardKey,
        qrImageOptions,
        logoImageLoaded.width,
        logoImageLoaded.height,
        img, // image bitmap to render in canvas
        REACT_APP_CLAIM_APP
      )))

      console.log((+ new Date()) - start)

      await downloadBase64FilesAsZip('png', result.flat(), qrSetName)
      currentPercentage = 0
      terminateWorkers(workers)
      dispatch(actionsQR.setDownloadLoader(0))
      dispatch(actionsQR.setDownloadItems([]))
      callback && callback()
    } catch (err) {
      currentPercentage = 0
      dispatch(actionsQR.setDownloadLoader(0))
      dispatch(actionsQR.setDownloadItems([]))
      callback && callback()
      alert('Some error occured, check console for more information')
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default downloadQRs
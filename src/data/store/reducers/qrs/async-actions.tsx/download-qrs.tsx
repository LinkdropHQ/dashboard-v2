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
const WORKERS_COUNT = 4 

const {
  REACT_APP_CLAIM_APP
} = process.env

const createWorker = async (cb: (value: number) => Promise<void>) => {
  const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
  const worker: Remote<QRsWorker> = await new RemoteChannel(proxy(cb))
  return worker
}

const createLinkGroups = (
  qrsArray: TQRItem[],
  workersCount: number
) => {
  const result = []
  const linksInGroup = qrsArray.length / workersCount
  while(qrsArray.length) {
    result.push(qrsArray.splice(0, Math.ceil(linksInGroup)))
  }
  return result
}

const createWorkers = async (
  linkGroups: TQRItem[][],
  cb: (value: number) => Promise<void>
) => {
  const workers: { worker: Remote<QRsWorker>, links: TQRItem[], worker_id: number }[] = []
  for (let x = 0; x < linkGroups.length; x++) {
    const worker = await createWorker(cb)
    workers.push({
      worker,
      links: linkGroups[x],
      worker_id: x
    })
  }

  return workers
}

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
    let currentPercentage = 0
    try {
      const workersCount = qrsArray.length <= 1000 ? 1 : WORKERS_COUNT
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

      const linkGroups = createLinkGroups(qrsArray, workersCount)
      console.log({ linkGroups })
      const workers = await createWorkers(linkGroups, updateProgressbar)
      console.log({ workers })
      const result = await Promise.all(workers.map(({
        worker,
        links
      }) => worker.downloadQRs(
        links,
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

      downloadBase64FilesAsZip('png', result.flat(), qrSetName)
      currentPercentage = 0
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
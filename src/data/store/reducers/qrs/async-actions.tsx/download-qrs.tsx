import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip } from 'helpers'
import { TQRItem } from "types"
import QRCodeStyling from 'qr-code-styling-bigmac'
import { decrypt } from 'lib/crypto'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink';

const ledgerImage = `                                                                                                                                                                                            
  <svg width="60" height="51" viewBox="0 0 60 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="51" fill="black"/>
    <path d="M5.40002 34.3V46.4H23.9V43.7H8.10003V34.2H5.40002V34.3ZM51.9 34.3V43.8H36.1V46.5H54.6V34.3H51.9ZM24 15.8V34.3H36.1V31.9H26.6V15.9H24V15.8ZM5.40002 3.60001V15.7H8.10003V6.3H23.9V3.60001H5.40002ZM36.1 3.60001V6.3H51.9V15.8H54.6V3.60001H36.1Z" fill="white"/>
  </svg>                                                                                                                                                                                                      
`

const ledgerImageUpdated = "data:image/svg+xml," + encodeURIComponent(ledgerImage)

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
      let qrs: Blob[] = []
      const start = +(new Date())
      const initialQR = new QRCodeStyling({
        data: `${REACT_APP_CLAIM_APP}/#/qr/`,
        width,
        height,
        margin: width / 60,
        type: 'svg',
        cornersSquareOptions: {
          color: "#FFF",
          type: 'square'
        },
        cornersDotOptions: {
          color: "#FFF",
          type: 'square'
        },
        dotsOptions: {
          color: "#FFF",
          type: "dots"
        },
        backgroundOptions: {
          color: "#000",
       },
        image: ledgerImageUpdated,
        imageOptions: {
          margin: width / 60,
          imageSize: 0.5,
          crossOrigin: 'anonymous',
        }
      })

      // worker test
      const updateProgressbar = async (value: number) => {
        console.log(`value from callback: `, value)
      }

      const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
      const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
  
      const test = await qrsWorker.downloadQRs()
      // worker test

      for (let i = 0; i < qrsArray.length; i++) {
        const decrypted_qr_secret = decrypt(qrsArray[i].encrypted_qr_secret, dashboardKey)
        initialQR.update({
          data: `${REACT_APP_CLAIM_APP}/#/qr/${decrypted_qr_secret}` 
        })

        const blob = await initialQR.getRawData('png')
        if (!blob) { continue }
        qrs = [...qrs, blob]
        const percentageFinished = Math.round((i + 1) / qrsArray.length * 100) / 100
        dispatch(actionsQR.setDownloadLoader(percentageFinished))
      }

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
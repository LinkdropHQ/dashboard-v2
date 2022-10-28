import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip, sleep } from 'helpers'
import { TQRItem } from "types"
import QRCodeStyling from 'qr-code-styling'
import { decrypt } from 'lib/crypto'
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

type tplotOptions = {
  [key: string]: any
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
    try {
      if (!dashboardKey) { return alert('dashboardKey is not provided') }
      if (!qrsArray) { return alert('qrsArray is not provided') }
      let qrs: Blob[] = []
      for (let i = 0; i < qrsArray.length; i++) {
        const decrypted_qr_secret = decrypt(qrsArray[i].encrypted_qr_secret, dashboardKey)
        const currentQr = new QRCodeStyling({
          data: `${REACT_APP_CLAIM_APP}/#/qr/${decrypted_qr_secret}`,
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
        // currentQr.applyExtension((svg, options) => {
        //   const border = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        //   const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        //   const { width, height } = options
        //   const size = Math.min(width || 0, height || 0)

        //   const borderAttributes: tplotOptions = {
        //     "fill": "none",
        //     "x": ((width || 0) - size + 60),
        //     "y": ((height || 0) - size + 60),
        //     "width": size - 120,
        //     "height": size - 120,
        //     "stroke": 'black',
        //     "stroke-width": size / 20,
        //     "rx": size / 20
        //   }

        //   // const textAttributes: tplotOptions = {
        //   //   "fill": "#000000",
        //   //   "x": (width || 0) / 2,
        //   //   "y": ((height || 0) - 24),
        //   //   "stroke": "#000000",
        //   //   "font-size": "24px",
        //   //   "text-anchor": "middle",
        //   //   "font-family": "Inter, Arial, Helvetica, sans-serif"
        //   // }

        //   Object.keys(borderAttributes).forEach(attribute => {
        //     border.setAttribute(attribute, borderAttributes[attribute]);
        //   })
        //   // Object.keys(textAttributes).forEach(attribute => {
        //   //   text.setAttribute(attribute, textAttributes[attribute]);
        //   // })
        //   text.textContent = 'Hello world!'
        //   svg.appendChild(border)
        //   svg.appendChild(text)
        // })

        const blob = await currentQr.getRawData('png')
        if (!blob) { continue }
        qrs = [...qrs, blob]
        const percentageFinished = Math.round((i + 1) / qrsArray.length * 100) / 100
        dispatch(actionsQR.setDownloadLoader(percentageFinished))
        await sleep(1)
      }

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
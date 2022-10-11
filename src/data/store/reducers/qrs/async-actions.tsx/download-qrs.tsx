import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { downloadBase64FilesAsZip, sleep } from 'helpers'
import { TQRItem } from "types"
import QRCodeStyling from 'qr-code-styling'
import { decrypt } from 'lib/crypto'
import { CLAIM_APP_QR } from 'configs/app'

const ledgerImage = `                                                                                                                                                                                            
     <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"                                                                               
       viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">                                                                                                                    
       <style type="text/css">                                                                                                                                                                                   
         .st0{fill:#FFFFFF;}                                                                                                                                                                                     
   </style>                                                                                                                                                                                                      
       <rect class="st0" width="100" height="100" />                                                                                                                                                             
       <path d="M21.8,8.5h53.7c8.8,0,16,7.2,16,16v53.7c0,7.3-5.9,13.3-13.3,13.3H21.8c-7.3,0-13.3-5.9-13.3-13.3V21.8                                                                                              
         C8.5,14.5,14.5,8.5,21.8,8.5z"/>                                                                                                                                                                         
   <path class="st0" d="M25.4,59.3v12.1h18.5v-2.7H28.1v-9.5H25.4z M71.9,59.3v9.5H56.1v2.7h18.5V59.3H71.9z M44,40.8v18.5h12.1v-2.4                                                                                
         h-9.5v-16H44z M25.4,28.6v12.1h2.7v-9.4h15.8v-2.7L25.4,28.6L25.4,28.6z M56.1,28.6v2.7h15.8v9.5h2.7V28.6H56.1z"/>                                                                                         
   </svg>                                                                                                                                                                                                        
  `

const ledgerImageUpdated = "data:image/svg+xml," + encodeURIComponent(ledgerImage)

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
          data: `${CLAIM_APP_QR}/#/qr/${decrypted_qr_secret}`,
          width,
          height,
          margin: 60,
          type: 'svg',
          cornersSquareOptions: {
            type: 'extra-rounded'
          },
          image: ledgerImageUpdated,
          imageOptions: {
            margin: 2,
            imageSize: 0.5,
            crossOrigin: 'anonymous'
          }
        })
        currentQr.applyExtension((svg, options) => {
          const border = document.createElementNS("http://www.w3.org/2000/svg", "rect")
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
          const { width, height } = options
          const size = Math.min(width || 0, height || 0)

          const borderAttributes: tplotOptions = {
            "fill": "none",
            "x": ((width || 0) - size + 60),
            "y": ((height || 0) - size + 60),
            "width": size - 120,
            "height": size - 120,
            "stroke": 'black',
            "stroke-width": size / 20,
            "rx": size / 20
          }

          // const textAttributes: tplotOptions = {
          //   "fill": "#000000",
          //   "x": (width || 0) / 2,
          //   "y": ((height || 0) - 24),
          //   "stroke": "#000000",
          //   "font-size": "24px",
          //   "text-anchor": "middle",
          //   "font-family": "Inter, Arial, Helvetica, sans-serif"
          // }

          Object.keys(borderAttributes).forEach(attribute => {
            border.setAttribute(attribute, borderAttributes[attribute]);
          })
          // Object.keys(textAttributes).forEach(attribute => {
          //   text.setAttribute(attribute, textAttributes[attribute]);
          // })
          text.textContent = 'Hello world!'
          svg.appendChild(border)
          svg.appendChild(text)
        })

        const blob = await currentQr.getRawData('svg')
        if (!blob) { continue }

        qrs = [...qrs, blob]
        dispatch(actionsQR.setDownloadItems(qrs))
        await sleep(1)
      }

      downloadBase64FilesAsZip('svg', qrs, qrSetName)
      dispatch(actionsQR.setDownloadItems([]))
      callback && callback()
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default downloadQRs
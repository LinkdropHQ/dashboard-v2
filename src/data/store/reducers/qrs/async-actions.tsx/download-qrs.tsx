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
  terminateWorkers,
  alertError,
  defineQROptions,
  defineClaimAppURL
} from 'helpers'
import { Remote } from 'comlink'
import { QRsWorker } from 'web-workers/qrs-worker'
import { plausibleApi } from 'data/api'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'

const downloadQRs = ({
  qrsArray,
  qrSetName,
  width,
  height,
  successCallback
}: {
  qrsArray: TQRItem[],
  qrSetName: string,
  width: number,
  height: number,
  successCallback?: () => void
}) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsQR.setLoading(true))

    const {
      user: {
        workersCount,
        address
      }
    } = getState()

    const callback = async (dashboardKey: string) => {
      const claimAppURL = defineClaimAppURL(address)

      let currentPercentage = 0

      try {
        const neededWorkersCount = qrsArray.length <= 1000 ? 1 : workersCount
        if (!qrsArray) { return alertError('qrsArray is not provided') }
        const start = +(new Date())
        
        const updateProgressbar = async (value: number) => {
          if (value === currentPercentage || value < currentPercentage) { return }
          currentPercentage = value
          dispatch(actionsQR.setDownloadLoader(currentPercentage))
          await sleep(1)
        }

        const qrOption = defineQROptions(address)

        const resp = await fetch(qrOption.icon)
        const blob = await resp.blob()
        const img = await createImageBitmap(blob as ImageBitmapSource)

        const logoImageLoaded = await loadImage(
          qrOption.imageOptions,
          qrOption.icon
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
          logoImageLoaded.width,
          logoImageLoaded.height,
          img, // image bitmap to render in canvas
          qrOption,
          claimAppURL
        )))

        console.log((+ new Date()) - start)

        for (let y = 0; y < result.length; y++) {
          console.log(`started download of ${y + 1} part of result`)
          await downloadBase64FilesAsZip(
            'png',
            result[y].qrs,
            result[y].data,
            `${qrSetName}-${y + 1}`,
            y * result[0].qrs.length
          )
          console.log(`finished download of ${y + 1} part of result`)
        }
    
        currentPercentage = 0
        terminateWorkers(workers)
        dispatch(actionsQR.setDownloadLoader(0))
        plausibleApi.invokeEvent({
          eventName: 'qr_download',
          data: {
            format: 'png'
          }
        })
        successCallback && successCallback()
      } catch (err) {
        currentPercentage = 0
        dispatch(actionsQR.setDownloadLoader(0))
        successCallback && successCallback()
        alertError('check console for more information')
        console.error(err)
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(actionsQR.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return
    }
    
    callback(dashboardKey)
    dispatch(actionsQR.setLoading(false))
  }
}

export default downloadQRs
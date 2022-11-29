import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { qrsApi } from 'data/api'
import {
  sleep,
  createQuantityGroups,
  createWorkers,
  terminateWorkers
} from 'helpers'
import { QRsWorker } from 'web-workers/qrs-worker'
import { Remote } from 'comlink';

const updateQRSetQuantity = ({
  setId,
  quantity,
  callback
}: {
  setId: string | number,
  quantity: number,
  callback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions>,
    getState: () => RootState
  ) => {
    const { qrs: { qrs }, user: { dashboardKey, workersCount } } = getState()
    try {
      const start = +(new Date())
      let currentPercentage = 0
      const neededWorkersCount = quantity <= 1000 ? 1 : workersCount
      if (!dashboardKey) { throw new Error('No dashboardKey found') }
      dispatch(actionsQR.setLoading(true))
      const updateProgressbar = async (value: number) => {
        if (value === currentPercentage || value < currentPercentage) { return }
        currentPercentage = value
        dispatch(actionsQR.setUploadLoader(currentPercentage))
        await sleep(1)
      }

      const quantityGroups = createQuantityGroups(quantity, neededWorkersCount)
      const workers = await createWorkers(
        quantityGroups,
        'qrs',
        updateProgressbar
      )
      
      const qrArray = await Promise.all(workers.map(({
        worker,
        data
      }) => (worker as Remote<QRsWorker>).prepareQRs(data as number, dashboardKey)))
      console.log({ qrArray })

      console.log((+ new Date()) - start)
      terminateWorkers(workers)

      const result = await qrsApi.updateQuantity(setId, qrArray.flat(), quantity)
      
      if (result && result.data && result.data.success) {
        const qrsUpdated = qrs.map(item => {
          if (item.set_id === setId) {
            return {
              ...item,
              qr_array: result.data.qr_array,
              qr_quantity: quantity
            }
          }
          return item
        })
        dispatch(actionsQR.setUploadLoader(0))
        dispatch(actionsQR.updateQrs(qrsUpdated))
        callback && callback()
      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}


export default updateQRSetQuantity
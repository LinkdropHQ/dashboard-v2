import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { TQRSet } from 'types'
import { qrsApi } from 'data/api'
import {
  sleep,
  createQuantityGroups,
  createWorkers,
  terminateWorkers
} from 'helpers'
import { QRsWorker } from 'web-workers/qrs-worker'
import { Remote } from 'comlink';

const addQRSet = ({
  title,
  quantity,
  callback
}: {
  title: string,
  quantity: number,
  callback?: (id: string | number) => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions>,
    getState: () => RootState
  ) => {
    const { user: { address, dashboardKey, workersCount } } = getState()
    try {
      let currentPercentage = 0
      const neededWorkersCount = quantity <= 1000 ? 1 : workersCount
      if (!dashboardKey) { throw new Error('No dashboardKey found') }
      dispatch(actionsQR.setLoading(true))
      const start = +(new Date())

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

      const newQr: TQRSet = {
        set_name: title,
        qr_quantity: quantity,
        status: 'NOT_SENT_TO_PRINTER',
        creator_address: address,
        qr_array: qrArray.flat()
      }

      console.log((+ new Date()) - start)
      terminateWorkers(workers)
  
      const result = await qrsApi.create(newQr)
      if (result.data.success) {
        dispatch(actionsQR.addQr(result.data.qr_set))
        dispatch(actionsQR.setUploadLoader(0))
        callback && callback(result.data._id)
      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default addQRSet
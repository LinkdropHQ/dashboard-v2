import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { qrsApi } from 'data/api'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink';
import { sleep } from 'helpers'

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
    const { qrs: { qrs }, user: { dashboardKey } } = getState()
    try {
      if (!dashboardKey) { throw new Error('No dashboardKey found') }
      dispatch(actionsQR.setLoading(true))
      const updateProgressbar = async (value: number) => {
        dispatch(actionsQR.setUploadLoader(value))
        await sleep(1)
      }

      const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
      const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
      
      const qrArray = await qrsWorker.prepareQRs(quantity, dashboardKey)
      const result = await qrsApi.updateQuantity(setId, qrArray, quantity)
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
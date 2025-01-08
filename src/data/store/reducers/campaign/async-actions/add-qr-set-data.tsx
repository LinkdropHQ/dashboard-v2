import { Dispatch } from 'redux'
import * as actionsQR from '../../qrs/actions'
import { QRsActions } from '../../qrs/types'
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
import { plausibleApi, qrManagerApi } from 'data/api'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'

const addQRSetData = ({
  campaignId,
  quantity,
  successCallback
}: {
  campaignId: string,
  quantity: number,
  successCallback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<QRManagerActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    let {
      user: {
        address,
        workersCount
      }
    } = getState()
    const callback = async (
      dashboardKey: string
    ) => {
      dispatch(actionsQR.setLoading(true))
      try {
        let currentPercentage = 0
        const neededWorkersCount = quantity <= 1000 ? 1 : workersCount
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

        const newQr: TQRSet = {
          qr_quantity: quantity,
          qr_array: qrArray.flat()
        }

        console.log((+ new Date()) - start)
        terminateWorkers(workers)
    
        const result = await qrsApi.create(newQr)
        if (result.data.success) {
          plausibleApi.invokeEvent({
            eventName: 'new_qr_set'
          })

          dispatch(actionsQR.addQr(result.data.qr_set))

          const qrManagerData = await qrManagerApi.get()
          const { success, items } = qrManagerData.data
          if (success) {
            dispatch(qrManagerActions.setItems(items))
          }
        
          dispatch(actionsQR.setUploadLoader(0))
          dispatch(actionsQR.setLoading(false))

          successCallback && successCallback()
        }
      } catch (err) {
        dispatch(actionsQR.setLoading(false))
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

export default addQRSetData
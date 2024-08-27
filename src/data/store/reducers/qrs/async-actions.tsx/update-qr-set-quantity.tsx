import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { qrsApi } from 'data/api'
import {
  sleep,
  createQuantityGroups,
  createWorkers,
  terminateWorkers,
  alertError
} from 'helpers'
import { QRsWorker } from 'web-workers/qrs-worker'
import { Remote } from 'comlink';
import { plausibleApi } from 'data/api'
import * as qrManagerActions from '../../qr-manager/actions'
import { QRManagerActions } from '../../qr-manager/types'
import * as actionsAsyncUser from '../../user/async-actions'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import { UserActions } from '../../user/types'

const updateQRSetQuantity = ({
  setId,
  quantity,
  successCallback
}: {
  setId: string | number,
  quantity: number,
  successCallback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions> & Dispatch<QRManagerActions> & Dispatch<UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsQR.setLoading(true))

    const {
      qrs: {
        qrs
      },
      user: {
        workersCount
      },
      qrManager: {
        items
      }
    } = getState()

    const callback = async (
      dashboardKey: string
    ) => {
      try {
        const start = +(new Date())
        let currentPercentage = 0
        const neededWorkersCount = quantity <= 1000 ? 1 : workersCount
  
        
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
          plausibleApi.invokeEvent({
            eventName: 'qr_upd_quantity'
          })
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
          const qrManagerItemsUpdated = items.map(item => {
            if (item.item_id === setId) { 
              return {
                ...item,
                links_count: quantity
              }
            }
            return item
          })
          dispatch(actionsQR.setUploadLoader(0))
          dispatch(actionsQR.updateQrs(qrsUpdated))
          dispatch(qrManagerActions.setItems(qrManagerItemsUpdated))
  
          successCallback && successCallback()
        }
      } catch (err) {
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


export default updateQRSetQuantity
import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import { alertError } from 'helpers'
import { TDispenser, TDispenserUpdateData } from 'types'
import { plausibleApi } from 'data/api'

type TUpdateDispenserDateArgs = {
  dispenserId: string,
  startDate: string,
  finishDate: string,
  callback?: () => void,
}

const updateDispenserDate = ({
  dispenserId,
  startDate,
  finishDate,
  callback
}: TUpdateDispenserDateArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>,
    getState: () => RootState
  ) => {
    const { user: { address }, dispensers: { dispensers } } = getState()
    dispatch(actionsDispensers.setLoading(true))
    try {

      const newFinishDate = finishDate ? +(new Date(finishDate)) : null
      const newStartDate = +(new Date(startDate))
      const updatedDispenser: TDispenserUpdateData = {
        claim_finish: newFinishDate,
        claim_start: newStartDate,
        dispenser_id: dispenserId
      }

      const { data } : {
        data: {
          dispenser: TDispenser,
          success: boolean
        }
      } = await dispensersApi.updateDispenserData(updatedDispenser)
      if (data.success) {
        const dispensersUpdated = dispensers.map(item => {
          if (item.dispenser_id === dispenserId) {
            return { ...item, ...data.dispenser }
          }
          return item
        })
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update',
          data: {
            success: 'yes',
            address,
            dispenserId
          }
        })
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
        dispatch(actionsDispensers.setLoading(false))

        if (callback) { callback() }
      } else {
        plausibleApi.invokeEvent({
          eventName: 'multiqr_update',
          data: {
            success: 'no',
            address,
            dispenserId
          }
        })
        return alertError('Dispenser was not updated. Check console for more information')
      }
      
    } catch (err) {
      plausibleApi.invokeEvent({
        eventName: 'multiqr_update',
        data: {
          success: 'no',
          address,
          dispenserId
        }
      })
      alertError('Couldn’t update Dispanser, please check console')
      console.error(err)
    }
    dispatch(actionsDispensers.setLoading(false))
  }
}

export default updateDispenserDate
import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { RootState } from 'data/store'
import { dispensersApi } from 'data/api'
import { alertError } from 'helpers'
import {
  TDispenserWhitelistType,
  TDispenserWhitelistItemAddress
} from 'types'

type TGetDispenserStatsArgs = {
  dispenser_id: string
  callback?: () => void
}

const getDispenserWhitelist = ({
  dispenser_id,
  callback
}: TGetDispenserStatsArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsDispensers.setLoading(true))
   
    const { dispensers: { dispensers } } = getState()
    try {
 
      const {
        data: {
          success: whitelistSuccess,
          whitelist
        }
      } : {
        data: {
          success: boolean,
          whitelist_type: TDispenserWhitelistType,
          whitelist: TDispenserWhitelistItemAddress[]
        }
      } = await dispensersApi.getWhitelist(dispenser_id)
      
      if (whitelistSuccess) {
        const dispensersUpdated = dispensers.map(item => {
          if (item.dispenser_id === dispenser_id) {
            let itemUpdated = { ...item, whitelist }
            return itemUpdated
          }
          return item
        })
        dispatch(actionsDispensers.setDispensers(dispensersUpdated))
        dispatch(actionsDispensers.setLoading(false))

        if (callback) { callback() }
      }
      
    } catch (err) {
      alertError('Couldn’t fetch Dispanser data, please check console')
      console.error(err)
    }

    dispatch(actionsDispensers.setLoading(false))
  }
}

export default getDispenserWhitelist
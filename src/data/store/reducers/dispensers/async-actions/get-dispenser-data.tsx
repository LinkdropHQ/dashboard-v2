import { Dispatch } from 'redux'
import * as actionsDispensers from '../actions'
import { DispensersActions } from '../types'
import { dispensersApi } from 'data/api'
import {
  TCampaign
} from 'types'

type TGetDispenserStatsArgs = {
  multiscan_qr_id: string
}

const getDispenserData = ({
  multiscan_qr_id
}: TGetDispenserStatsArgs) => {
  return async (
    dispatch: Dispatch<DispensersActions>
  ) => {
    dispatch(actionsDispensers.setLoading(true))
    dispatch(actionsDispensers.setCurrentDispenserData({ campaign: null }))

    try {
      const {
        data: {
          success: campaignSuccess,
          campaign
        }
      } : {
        data: {
          success: boolean,
          campaign: TCampaign
        }
      } = await dispensersApi.getCampaignData(multiscan_qr_id)

      if (campaignSuccess) {
        dispatch(actionsDispensers.setCurrentDispenserData({ campaign }))
      }
      
    } catch (err) {
      console.error(err)
    }

    dispatch(actionsDispensers.setLoading(false))
  }
}

export default getDispenserData
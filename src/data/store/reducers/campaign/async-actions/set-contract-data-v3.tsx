import { campaignsApi } from "data/api"
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import {
  alertError,
  createProxy
} from 'helpers'
import { TTokenType } from "types"

const setContractData = (
  tokenStandard: TTokenType,
  tokenAddress: string,
  callback: () => void
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {

    try {
      dispatch(actionsCampaign.setTokenStandard(tokenStandard))
      dispatch(actionsCampaign.setTokenAddress(tokenAddress))
      callback()   
    } catch (err) {
      alertError('Some error occured. Please check console for more info')
    }
    
  }
}

export default setContractData
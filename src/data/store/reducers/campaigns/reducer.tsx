import { CampaignsState, CampaignsActions } from './types'
import { Constants } from './constants'

const initialState: CampaignsState = {
  campaigns: [],
  loading: false
}

export function campaignsReducer(
  state: CampaignsState = initialState,
  action: CampaignsActions
): CampaignsState {
    switch (action.type) {
      case Constants.CAMPAIGNS_ADD_NEW_CAMPAIGN:
        return {...state, campaigns: [ ...state.campaigns, action.payload ] }
      case Constants.CAMPAIGNS_SET_LOADING:
        return {...state, loading: action.payload }
      case Constants.CAMPAIGNS_UPDATE_CAMPAIGNS:
        return {...state, campaigns: action.payload }
      default:
          return state;
    }
}
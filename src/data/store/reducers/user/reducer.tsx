import { UserState, UserActions } from './types';
import { Constants } from './constants';

const initialState: UserState = {
  address: '',
  loading: false,
  provider: null,
  chainId: null,
  nativeTokenAmount: null,
  tokenAmount: null,
  nativeTokenAmountFormatted: null,
  tokenAmountFormatted: null,
  sdk: null,
  dashboardKey: null
};

export function userReducer(
  state: UserState = initialState,
  action: UserActions
): UserState {
    switch (action.type) {
      case Constants.USER_SET_ADDRESS:
        return { ...state, address: action.payload.address }
      case Constants.USER_SET_LOADING:
        return {...state, loading: action.payload.loading }
      case Constants.USER_SET_PROVIDER:
        return {...state, provider: action.payload.provider }
      case Constants.USER_SET_CHAIN_ID:
        return {...state, chainId: action.payload.chainId }
      case Constants.USER_SET_SDK:
        return {...state, sdk: action.payload.sdk }
      case Constants.USER_SET_DASHBOARD_KEY:
        return {...state, dashboardKey: action.payload.dashboardKey }
      case Constants.USER_SET_TOKEN_AMOUNT:
        return {
          ...state,
          tokenAmount: action.payload.tokenAmount,
          tokenAmountFormatted: action.payload.tokenAmountFormatted
        }
      case Constants.USER_SET_NATIVE_TOKEN_AMOUNT:
        return {
          ...state,
          nativeTokenAmount: action.payload.nativeTokenAmount,
          nativeTokenAmountFormatted: action.payload.nativeTokenAmountFormatted
        }
      default:
          return state;
    }
}
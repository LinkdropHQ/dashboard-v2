import { UserState, UserActions } from './types'
import { Constants } from './constants'
import chains from 'configs/chains'
import { BigNumber } from 'ethers'

const { REACT_APP_CHAINS } = process.env
const chainsAvailable: number[] = REACT_APP_CHAINS ? JSON.parse(REACT_APP_CHAINS) : Object.keys(chains)

const initialState: UserState = {
  address: '',
  loading: false,
  provider: null,
  jsonRPCProvider: null,
  signer: null,
  chainId: null,
  nativeTokenAmount: BigNumber.from('0'),
  tokenAmount: null,
  sdk: null,
  connectorId: null,
  dashboardKey: null,
  workersCount: (navigator && navigator.hardwareConcurrency) || 4,
  authorizationStep: 'initial',
  chainsAvailable: chainsAvailable,
  contracts: [],
  contractsERC20: [],
  nfts: [],
  whitelisted: null,
  comission: '0',
  tokenListERC20: {},
  countries: [],
  dashboardKeyPopup: false,
  dashboardKeyPopupCallback: null
};

export function userReducer(
  state: UserState = initialState,
  action: UserActions
): UserState {
    switch (action.type) {
      case Constants.USER_SET_ADDRESS:
        return { ...state, address: action.payload.address }
      case Constants.USER_SET_DASHBOARD_KEY_POPUP_CALLBACK:
        return { ...state, dashboardKeyPopupCallback: action.payload.dashboardKeyPopupCallback }
      case Constants.USER_SET_DASHBOARD_KEY_POPUP:
        return { ...state, dashboardKeyPopup: action.payload.dashboardKeyPopup }
      case Constants.USER_SET_COUNTRIES:
        return { ...state, countries: action.payload.countries }
      case Constants.USER_SET_CONNECTOR_ID:
        return { ...state, connectorId: action.payload.connectorId }
      case Constants.USER_SET_LOADING:
        return {...state, loading: action.payload.loading }
      case Constants.USER_SET_PROVIDER:
        return {...state, provider: action.payload.provider }
      case Constants.USER_SET_JSON_RPC_PROVIDER:
        return {...state, jsonRPCProvider: action.payload.jsonRPCProvider }
      case Constants.USER_SET_SIGNER:
        return {...state, signer: action.payload.signer }
      case Constants.USER_SET_CHAIN_ID:
        return {...state, chainId: action.payload.chainId }
      case Constants.USER_SET_SDK:
        return {...state, sdk: action.payload.sdk }
      case Constants.USER_SET_DASHBOARD_KEY:
        return {...state, dashboardKey: action.payload.dashboardKey }
      case Constants.USER_SET_AUTHORIZATION_STEP:
        return {...state, authorizationStep: action.payload.authorizationStep }
      case Constants.USER_SET_CONTRACTS:
        return {...state, contracts: action.payload.contracts }
      case Constants.USER_SET_TOKEN_LIST_ERC20:
        return {...state, tokenListERC20: action.payload.tokenListERC20 }
      case Constants.USER_SET_CONTRACTS_ERC20:
        return {...state, contractsERC20: action.payload.contractsERC20 }
      case Constants.USER_SET_NFTS:
        return {...state, nfts: action.payload.nfts }
      case Constants.USER_SET_WHITELISTED:
        return {...state, whitelisted: action.payload.whitelisted }
      case Constants.USER_SET_COMISSION:
        return {...state, comission: action.payload.comission }
      case Constants.USER_SET_TOKEN_AMOUNT:
        return {
          ...state,
          tokenAmount: action.payload.tokenAmount,
        }
      case Constants.USER_SET_NATIVE_TOKEN_AMOUNT:
        return {
          ...state,
          nativeTokenAmount: action.payload.nativeTokenAmount,
        }
      default:
          return state;
    }
}
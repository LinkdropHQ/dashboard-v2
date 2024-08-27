import { ActionType } from 'typesafe-actions';
import * as actions from './actions'
import { Dispatch } from 'redux'
import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import { TAuthorizationStep, TNFTContract, TNFTToken, TERC20Contract, TERC20TokenList, TCountry } from 'types'
import { BigNumber } from 'ethers'

export interface UserState {
  address: string
  loading: boolean
  provider: any
  jsonRPCProvider: any
  signer: any
  chainId: number | null
  nativeTokenAmount: BigNumber | null
  tokenAmount: BigNumber | null
  sdk: LinkdropBatchSDK | null
  dashboardKey: null | string
  workersCount: number
  authorizationStep: TAuthorizationStep
  chainsAvailable: (number | string)[]
  contracts: TNFTContract[]
  contractsERC20: TERC20Contract[]
  tokenListERC20: TERC20TokenList
  nfts: TNFTToken[]
  whitelisted: boolean | null
  comission: string
  countries: TCountry[]
  connectorId: null | string
  dashboardKeyPopup: boolean
  dashboardKeyPopupCallback: ((dashboardKey: string) => void) | null
}

export type UserActions = ActionType<typeof actions>;

export type TGetNativeTokenBalance = (
  dispatch: Dispatch<UserActions>,
  chainId: number,
  address: string,
  provider: any
) => void

export type TGetTokenBalance = (
  dispatch: Dispatch<UserActions>,
  address: string,
  decimals: number,
  contract: any
) => void

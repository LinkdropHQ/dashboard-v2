import { ActionType } from 'typesafe-actions';
import * as actions from './actions'
import { TQRSet } from 'types'

export interface QRsState {
  qrs: TQRSet[],
  loading: boolean,
  downloadItems: Blob[],
  uploadLoader: number,
  downloadLoader: number,
  mappingLoader: number
}

export type QRsActions = ActionType<typeof actions>;
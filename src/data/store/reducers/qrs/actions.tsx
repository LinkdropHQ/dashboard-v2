import { action } from 'typesafe-actions';
import { Constants } from './constants';
import { TQRSet } from 'types'

export function addQr(qr: TQRSet) {
  return action(Constants.QRS_ADD_NEW_QR, qr)
}

export function updateQrs(qrs: TQRSet[]) {
  return action(Constants.QRS_UPDATE_QRS, qrs)
}

export function setLoading(loading: boolean) {
  return action(Constants.QRS_SET_LOADING, loading)
}

export function setDownloadItems(downloadItems: Blob[]) {
  return action(Constants.QRS_SET_DOWNLOAD_ITEMS, downloadItems)
}

export function setUploadLoader(uploadLoader: number) {
  return action(Constants.QRS_SET_UPLOAD_LOADER, { uploadLoader })
}

export function setDownloadLoader(downloadLoader: number) {
  return action(Constants.QRS_SET_DOWNLOAD_LOADER, { downloadLoader })
}

export function setMappingLoader(mappingLoader: number) {
  return action(Constants.QRS_SET_MAPPING_LOADER, { mappingLoader })
}
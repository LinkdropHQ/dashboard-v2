import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { TQRItem, TLinkDecrypted } from 'types'
import { qrsApi } from 'data/api'
import { mapQRsWithLinks } from 'helpers'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!web-workers/qrs-worker'
import { QRsWorker } from 'web-workers/qrs-worker'
import { wrap, Remote, proxy } from 'comlink';
import { sleep } from 'helpers'

const mapQRsWithLinksAction = ({
  setId,
  links,
  qrs,
  callback
}: {
  setId: string,
  links: TLinkDecrypted[],
  qrs: TQRItem[],
  callback?: () => void,
}) => {
  return async (
    dispatch: Dispatch<QRsActions>,
    getState: () => RootState
  ) => {
    const { qrs: { qrs: qrSets }, user: { dashboardKey } } = getState()
    try {
      if (!dashboardKey) {
        throw new Error('dashboardKey is not provided')
      }
      dispatch(actionsQR.setLoading(true))

      const updateProgressbar = async (value: number) => {
        dispatch(actionsQR.setMappingLoader(value))
        await sleep(1)
      }

      const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
      const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
  
      const qrArrayMapped = await qrsWorker.mapQrsWithLinks(qrs, links, dashboardKey)
      const result = await qrsApi.mapLinks(setId, qrArrayMapped)
      if (result.data.success) {
        const qrsUpdated = qrSets.map(item => {
          if (item.set_id === setId) {
            return {
              ...item,
              links_uploaded: true
            }
          }
          return item
        })
        dispatch(actionsQR.updateQrs(qrsUpdated))
        dispatch(actionsQR.setMappingLoader(0))
        callback && callback()
      }
    } catch (err) {
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default mapQRsWithLinksAction
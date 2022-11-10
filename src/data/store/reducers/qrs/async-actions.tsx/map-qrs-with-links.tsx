import { Dispatch } from 'redux'
import * as actionsQR from '../actions'
import { QRsActions } from '../types'
import { RootState } from 'data/store'
import { TQRItem, TLinkDecrypted } from 'types'
import { qrsApi } from 'data/api'
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
      let currentPercentage = 0
      if (!dashboardKey) {
        throw new Error('dashboardKey is not provided')
      }
      dispatch(actionsQR.setLoading(true))
      const start = +(new Date())

      const updateProgressbar = async (value: number) => {
        if (value === currentPercentage || value < currentPercentage) { return }
        currentPercentage = value
        dispatch(actionsQR.setMappingLoader(currentPercentage))
        await sleep(1)
      }

      const RemoteChannel = wrap<typeof QRsWorker>(new Worker())
      const qrsWorker: Remote<QRsWorker> = await new RemoteChannel(proxy(updateProgressbar));
  
      const qrArrayMapped = await qrsWorker.mapQrsWithLinks(qrs, links, dashboardKey)
      console.log((+ new Date()) - start)
      const result = await qrsApi.mapLinks(setId, qrArrayMapped)
      const qrsUpdated = qrSets.map(item => {
        if (item.set_id === setId) {
          return {
            ...item,
            links_uploaded: result.data.success
          }
        }
        return item
      })

      
      dispatch(actionsQR.updateQrs(qrsUpdated))
      callback && callback()
      if (!result.data.success) {
        alert('Couldn’t connect links to QRs, please try again')
      }
      dispatch(actionsQR.updateQrs(qrsUpdated))
      dispatch(actionsQR.setMappingLoader(0))
    } catch (err) {
      const qrsUpdated = qrSets.map(item => {
        if (item.set_id === setId) {
          return {
            ...item,
            links_uploaded: false
          }
        }
        return item
      })
      dispatch(actionsQR.updateQrs(qrsUpdated))
      alert('Couldn’t connect links to QRs, please try again')
      dispatch(actionsQR.setMappingLoader(0))
      console.error(err)
    }
    dispatch(actionsQR.setLoading(false))
  }
}

export default mapQRsWithLinksAction
import { FC, useEffect } from 'react'
import { useParams, Redirect, useLocation } from 'react-router-dom'
import { TLinkParams, TQRSet, TQRItem } from 'types'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Container,
  DownloadProgressBar
} from './styled-components'
import * as asyncQRsActions from 'data/store/reducers/qrs/async-actions.tsx'

const mapStateToProps = ({
  campaigns: { campaigns },
  qrs: { qrs, loading, downloadLoader, downloadItems },
  user: { address, chainId, dashboardKey },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  qrs,
  loading,
  dashboardKey,
  downloadLoader, downloadItems
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    getQRsArray: (setId: string | number) => dispatch(asyncQRsActions.getQRs({ setId })),
    downloadQRs: (
      qrsArray: TQRItem[],
      qrSetName: string,
      width: number,
      height: number,
      callback: () => void
    ) => dispatch(asyncQRsActions.downloadQRs({ qrsArray, qrSetName, width, height, callback }))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const QR: FC<ReduxType> = ({
  qrs,
  downloadQRs,
  downloadLoader
}) => {
  const { id } = useParams<TLinkParams>()
  const qr: TQRSet | undefined = qrs.find(qr => String(qr.set_id) === id)
  const history = useHistory()
  let { search } = useLocation();

  const query = new URLSearchParams(search)
  useEffect(() => {
    const width = query.get('width')
    const height = query.get('height')
    if (!qr || !qr.qr_array) { return alert('qr_array is not provided') }
    downloadQRs(qr.qr_array, qr.set_name, Number(width), Number(height), () => {
      history.push(`/qrs/${id}`)
    })
  }, [])


  if (!qr) {
    return <Redirect to='/qrs' /> 
  }

  return <Container>
    <DownloadProgressBar
      max={100}
      current={Math.ceil(downloadLoader * 100)}
    />

  </Container>
}

export default connect(mapStateToProps, mapDispatcherToProps)(QR)
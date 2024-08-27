import { FC, useEffect } from 'react'
import { useParams, Redirect, useLocation } from 'react-router-dom'
import { TLinkParams, TQRSet, TQRItem } from 'types'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { alertError, preventPageClose } from 'helpers'
import {
  Container,
  GenerateProgressBar,
  GenerateTitle,
  GenerateSubtitle,
  GenerateProgress
} from './styled-components'

import * as asyncQRsActions from 'data/store/reducers/qrs/async-actions.tsx'

const mapStateToProps = ({
  campaigns: { campaigns },
  qrs: { qrs, loading, downloadItems, downloadLoader },
  user: { address, chainId },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  qrs,
  loading,
  downloadItems,
  downloadLoader
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    downloadQRs: (
      qrsArray: TQRItem[],
      qrSetName: string,
      width: number,
      height: number,
      successCallback: () => void
    ) => dispatch(asyncQRsActions.downloadQRs({ qrsArray, qrSetName, width, height, successCallback }))
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
    if (!qr || !qr.qr_array) { return alertError('qr_array is not provided') }
    downloadQRs(qr.qr_array, qr.set_name, Number(width), Number(height), () => {
      history.push(`/qrs/${id}`)
    })
  }, [])

  useEffect(preventPageClose(), [])

  if (!qr) {
    return <Redirect to='/qrs' /> 
  }

  return <Container>
    <GenerateProgress>
      {Math.ceil(downloadLoader * 100)}%
    </GenerateProgress>

    <GenerateTitle>
      QRs download
    </GenerateTitle>
    <GenerateSubtitle>
      Don’t close this window until all QRs are successfully downloaded
    </GenerateSubtitle>
    
    <GenerateProgressBar
      max={100}
      current={Math.ceil(downloadLoader * 100)}
    />
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(QR)
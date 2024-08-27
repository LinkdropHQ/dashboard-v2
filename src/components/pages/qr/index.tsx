import { FC, useEffect, useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import {
  TLinkParams, 
  TQRSet,
  TQRStatus,
  TSelectOption,
  TQRItem,
  TLinkDecrypted
} from 'types'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import {
  defineQRStatusName
} from 'helpers'
import qrStatus from 'configs/qr-status'
import { QuantityPopup } from './components'
import { TextLink } from 'components/common'
import { Note } from 'linkdrop-ui'
import {
  WidgetInfo,
  WidgetValue,
  Buttons,
  WidgetButton,
  StyledSelect,
  WidgetSubtitleStyled,
  Paragraph
} from './styled-components'
import {
  WidgetComponent,
  Container,
  Aside,
  WidgetSubtitle,
  TableRow,
  TableValue,
  DownloadQRPopup,
  UploadLinksPopup
} from 'components/pages/common'
import * as asyncQRsActions from 'data/store/reducers/qrs/async-actions.tsx'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({
  campaigns: { campaigns },
  qrs: { qrs, loading, mappingLoader, uploadLoader },
  user: { address, chainId, whitelisted },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  qrs,
  loading,
  mappingLoader, uploadLoader, whitelisted
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    updateQRSetStatus: (
      setId: string | number,
      newStatus: TQRStatus,
      callback: () => void
    ) => dispatch(asyncQRsActions.updateQRSetStatus({ setId, newStatus, callback })),

    updateQRSetQuantity: (
      setId: string | number,
      quantity: number,
      callback: () => void
    ) => dispatch(asyncQRsActions.updateQRSetQuantity({ setId, quantity, successCallback: callback })),

    mapQRsToLinks: (
      setId: string,
      links: TLinkDecrypted[],
      qrs: TQRItem[],
      callback?: () => void,
    ) => dispatch(asyncQRsActions.mapQRsWithLinks({ setId, links, qrs, successCallback: callback })),

    downloadQRsAsCSV: (
      id: string
    ) => {
      dispatch(asyncQRsActions.downloadQRsAsCSV(
        id
      ))
    },

    getQRsArray: (setId: string | number) => dispatch(asyncQRsActions.getQRs({ setId })),
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const QR: FC<ReduxType> = ({
  qrs,
  updateQRSetStatus,
  loading,
  mapQRsToLinks,
  updateQRSetQuantity,
  getQRsArray,
  mappingLoader,
  uploadLoader,
  downloadQRsAsCSV,
  whitelisted
}) => {
  const { id } = useParams<TLinkParams>()

  // @ts-ignore
  const qr: TQRSet | undefined = qrs.find(qr => String(qr.set_id) === id)
  const [ status, setStatus ] = useState<TSelectOption | null>(null)
  const history = useHistory()

  const [
    updateQuantityPopup,
    toggleUpdateQuantityPopup
  ] = useState<boolean>(false)
  const [
    updateLinksPopup,
    toggleUpdateLinksPopup
  ] = useState<boolean>(false)

  const [
    downloadPopup,
    toggleDownloadPopup
  ] = useState<boolean>(false)

  const selectOptions: TSelectOption<TQRStatus>[] = qrStatus.map(status => ({
    label: defineQRStatusName(status),
    value: status
  })) 

  useEffect(() => {
    if (!qr) { return }
    const option = selectOptions.find(item => item.value === qr.status)
      if (!option) { return }
      setStatus(option)
  }, [qr])

  useEffect(() => {
    if (!qr) { return }
    if (!qr.set_id) { return }
    getQRsArray(qr.set_id)
  }, [qr?.updated_at])

  if (!qr) {
    return <Redirect to='/qrs' /> 
  }

  const defineIfDisabled = () => {
    return !qr.qr_array || loading
  }

  const defineAsideContent = (uploaded?: boolean) => {
    if (!uploaded) {
      return <>
        <Paragraph>
          Upload a CSV file with links. Number of rows in the file should be equal to the number of QR codes. 
        </Paragraph>
        <Paragraph>
          If you haven’t created claim links yet, then do it in <TextLink to='/campaigns'>Campaigns</TextLink>
        </Paragraph>
        <Note>
          You will not be able to change the quantity of QRs after uploading links
        </Note>
      </>
    }
    return <>
      <Paragraph>
        Claim links are successfully connected to QR codes
      </Paragraph>
      <TableRow>
        <TableValue>
          {qr.qr_quantity || 0} links connected
        </TableValue>
        <TableValue>
          <WidgetButton
            size='extra-small'
            disabled={false}
            appearance='additional'
            title='Update links'
            onClick={() => {
              toggleUpdateLinksPopup(true)
            }}
          />
        </TableValue>
      </TableRow>
    </>
  }

  return <Container>
   {updateQuantityPopup && <QuantityPopup
      onClose={() => toggleUpdateQuantityPopup(false)}
      quantity={qr.qr_quantity}
      whitelisted={Boolean(whitelisted)}
      loading={loading}
      loader={uploadLoader}
      onSubmit={value => {
        if (!id) { return }
        updateQRSetQuantity(
          id,
          Number(value),
          () => { toggleUpdateQuantityPopup(false) }
        )}
      }
    />}

    {updateLinksPopup && <UploadLinksPopup
      quantity={qr.qr_quantity}
      loader={mappingLoader}
      loading={loading}
      onClose={() => toggleUpdateLinksPopup(false)}
      onSubmit={links => {
        if (!id || !qr.qr_array) { return }
        mapQRsToLinks(id, links, qr.qr_array, () => {
          toggleUpdateLinksPopup(false)
        })
      }}
    >
      <Note>
        You will not be able to change quantity of QR's after upload of links
      </Note>
    </UploadLinksPopup>}

    {id && downloadPopup && <DownloadQRPopup
      onSubmit={(size: number) => history.push(`/qrs/${id}/download?width=${encodeURIComponent(size)}&height=${encodeURIComponent(size)}`)}
      onClose={() => toggleDownloadPopup(false)}
    />}
    <WidgetComponent title='Manage set'>
      <WidgetSubtitle>Manage the quantity of QR codes and track their status</WidgetSubtitle>
      <WidgetSubtitleStyled>
        Quantity of QRs
      </WidgetSubtitleStyled>
      <WidgetInfo>
        <WidgetValue>
          {qr.qr_quantity}
        </WidgetValue>
        <WidgetButton
          title='Change quantity'
          size='extra-small'
          appearance='additional'
          disabled={qr.links_uploaded || qr.status !== 'NOT_SENT_TO_PRINTER'}
          onClick={() => {
            toggleUpdateQuantityPopup(true)
          }}
        />
      </WidgetInfo>
      <StyledSelect
        options={selectOptions}
        title='Status'
        value={status ? status : undefined}
        onChange={option => {
          if (!id) { return }
          updateQRSetStatus(
            id,
            option.value as TQRStatus,
            () => { setStatus(option) }
          )
        }}
        placeholder='Status'
      />
      <Buttons>
        <WidgetButton
          title='Back'
          appearance='default'
          to='/qrs'
        /> 
        <WidgetButton
          title='Download'
          appearance='action'
          
          onClick={() => {
            toggleDownloadPopup(true)
          }}
        /> 
        <WidgetButton
          title='Download (as CSV)'
          appearance='action'
          disabled={defineIfDisabled()}
          onClick={() => {
            if (!qr.qr_array) { return }
            downloadQRsAsCSV(
              id as string
            )
          }}
        />
      </Buttons>
    </WidgetComponent>
    <Aside
      title="Connect to claim links"
      back={{}}
      next={qr.links_uploaded ? {} : {
        title: 'Upload file',
        action: () => {
          toggleUpdateLinksPopup(true)
        }
      }}
    >
      {defineAsideContent(qr.links_uploaded)}
    </Aside>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(QR)
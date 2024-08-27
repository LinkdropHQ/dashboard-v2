import { FC, useState } from 'react'
import {
  Container,
  Header,
  WidgetTitleStyled,
  ContainerButton,
  DispensersListValueFixed,
  DispensersListStyled,
  BatchListLabelTextAlignRight,
  BatchListValueJustifySelfEnd
} from './styled-components'
import {
  Button,
  Tag,
  Loader
} from 'components/common'
import {
  NewDispenser
} from './components'
import {
  BatchListLabel,
  BatchListValue,
  WidgetComponent,
  InitialNote
} from 'components/pages/common'
import {
  formatDate,
  defineDispenserStatus, 
  defineDispenserStatusTag,
  defineQRStatusName,
  shortenString
} from 'helpers'
import {
  TQRStatus,
  TQRManagerItem
} from 'types'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = ({
  campaigns: { campaigns },
  user: { address, chainId },
  qrManager: {
    loading,
    items
  }
}: RootState) => ({
  campaigns,
  address,
  chainId,
  items,
  loading
})

const createDispenserRow = (
  qrManagerItem: TQRManagerItem
) => {
  const {
    title,
    links_count,
    item_id,
    claim_duration,
    created_at,
    claim_start,
    claim_finish,
    active,
    redirect_on,
    redirect_url,
    timeframe_on,
    dynamic,
    links_assigned,
    links_claimed
  } = qrManagerItem

  const currentStatus = defineDispenserStatus(
    claim_start as number,
    (claim_finish as number) || claim_start as number + (claim_duration || 1000000000000),
    links_count || 0,
    active,
    redirect_on as boolean,
    redirect_url,
    timeframe_on
  )
  const dateCreatedFormatted = formatDate(created_at || '')
  const claimStartWithNoOffset = moment(claim_start).utcOffset(0)
  const claimStartDate = claimStartWithNoOffset.format('MMMM D, YYYY')
  const redirectUrl = defineHref(
    item_id as string,
    dynamic
  )
  return <>
    <BatchListValue>
      {dateCreatedFormatted}
    </BatchListValue>
    <BatchListValue>
      {claimStartDate}
    </BatchListValue>
    <BatchListValue>
      {defineQRType(dynamic)}
    </BatchListValue>
    <DispensersListValueFixed>
      {title}
    </DispensersListValueFixed>

    <BatchListValue>
      {links_count || '0'}
    </BatchListValue>
    <BatchListValue>
      {links_assigned || '0'}
    </BatchListValue>
    <BatchListValue>
      {links_claimed || '0'}
    </BatchListValue>
    <BatchListValue>{defineDispenserStatusTag(currentStatus)}</BatchListValue>
    <BatchListValueJustifySelfEnd>
      <Button
        appearance='additional'
        size='extra-small'
        title='Manage'
        to={redirectUrl}
      />
    </BatchListValueJustifySelfEnd>
  </>
}

const createQRSetRow = (
  qrManagerItem: TQRManagerItem
) => {
  const {
    title,
    links_count,
    item_id,
    created_at,
    status,
    links_assigned,
    links_claimed
  } = qrManagerItem

  return <>
    <BatchListValue>{created_at && formatDate(created_at)}</BatchListValue>
    <BatchListValue>-</BatchListValue>
    <BatchListValue>QR set</BatchListValue>
    <DispensersListValueFixed>{title}</DispensersListValueFixed>

    <BatchListValue>
      {links_count || '0'}
    </BatchListValue>
    <BatchListValue>
      {links_assigned || '0'}
    </BatchListValue>
    <BatchListValue>
      {links_claimed || '0'}
    </BatchListValue>
    <BatchListValue>
      {defineQrSetStatus(status)}
    </BatchListValue>
    <BatchListValueJustifySelfEnd>
      <Button
        appearance='additional'
        size='extra-small'
        title='Manage'
        to={`/qrs/${item_id}`}
      />
    </BatchListValueJustifySelfEnd>
  </>
}

const defineQRType = (
  dynamic?: boolean,
) => {
  if (dynamic) {
    return 'Dynamic'
  }

  return 'Dispenser'
}

const defineHref = (
  dispenserId: string,
  dynamic?: boolean,
) => {
  if (!dynamic) {
    return `/dispensers/${dispenserId}`
  }

  return `/dynamic-qrs/${dispenserId}`
}

const defineQrSetStatus = (
  status: TQRStatus
) => {
  const statusName = defineQRStatusName(status)
  return <Tag title={statusName} status='info' />
}


// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps>

const Dispensers: FC<ReduxType> = ({
  items,
  loading
}) => {

  const [
    showPopup,
    setShowPopup
  ] = useState<boolean>(false)


  if (
    loading &&
    items.length === 0
  ) {
    return <Loader size='large' />
  }

  if (items.length === 0) {
    return <>
      <InitialNote
        title='Create Your First QR campaign'
        text="Start new QR campaign to distribute your tokens by choosing the method that best suits your needs:"
        onClick={() => {
          setShowPopup(true)
        }}
        buttontText='New QR Campaign'
      />
      {showPopup && <NewDispenser
        onClose={() => {
          setShowPopup(false)
        }}
      />}
    </>
  }

  return <Container>
    {showPopup && <NewDispenser
      onClose={() => {
        setShowPopup(false)
      }}
    />}
    <WidgetComponent>
      <Header>
        <WidgetTitleStyled>
          QR campaigns
        </WidgetTitleStyled>
        <ContainerButton
          title='+ New'

          disabled={loading}
          size='extra-small'
          appearance='action'
          onClick={() => {
            setShowPopup(true)
          }}
        />
      </Header>
      {items.length > 0 && <DispensersListStyled>
        <BatchListLabel>Created</BatchListLabel>
        <BatchListLabel>Start date</BatchListLabel>
        <BatchListLabel>QR Type</BatchListLabel>
        <BatchListLabel>Name</BatchListLabel>
        <BatchListLabel>Links</BatchListLabel>
        <BatchListLabel>Scans</BatchListLabel>
        <BatchListLabel>Claims</BatchListLabel>
        <BatchListLabel>Status</BatchListLabel>
        <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>
        
        {items.map(qrItem => {
          const {
            type
          } = qrItem

          if (type === 'dispenser') {
            return createDispenserRow(qrItem)
          }

          return createQRSetRow(qrItem)
        })}
      </DispensersListStyled>}
    </WidgetComponent>
  </Container>
}

export default connect(mapStateToProps)(Dispensers)


// {qrs.map(qrSet => {
  
// }
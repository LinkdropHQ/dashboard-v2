import { FC } from 'react'
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
  BatchListLabel,
  BatchListValue,
  WidgetComponent,
  InitialNote,
} from 'components/pages/common'
import {
  useHistory
} from 'react-router-dom'
import {
  formatDate,
  defineDispenserStatus, 
  defineDispenserStatusTag
} from 'helpers'
import {
  TQRManagerItem
} from 'types'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import moment from 'moment'
import Icons from 'icons'
import { Tooltip } from 'components/common'

const mapStateToProps = ({
  user: { address, chainId },
  dispensers: {
    loading
  },
  qrManager: {
    items
  }
}: RootState) => ({
  address,
  chainId,
  loading,
  items
})

const createReclaimRow = (
  reclaimItem: TQRManagerItem
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
    links_assigned,
    links_claimed,
    reclaim
  } = reclaimItem

  const currentStatus = defineDispenserStatus(
    claim_start as number,
    (claim_finish as number) || claim_start as number + (claim_duration || 1000000000000),
    links_count || 0,
    active,
    redirect_on as boolean,
    redirect_url,
    timeframe_on
  )

  const redirectUrl = defineHref(item_id as string)

  const buttons = <BatchListValueJustifySelfEnd>
    <Button
      appearance='additional'
      size='extra-small'
      to={redirectUrl}
    >
      Manage
    </Button>
  </BatchListValueJustifySelfEnd>

  const dateCreatedFormatted = formatDate(created_at || '')
  const claimStartWithNoOffset = moment(claim_start).utcOffset(0)
  const claimStartDate = claimStartWithNoOffset.format('MMMM D, YYYY')

  return <>
    <BatchListValue>
      {dateCreatedFormatted}
    </BatchListValue>
    <BatchListValue>
      {claimStartDate}
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
    {buttons}
  </>
}

const defineHref = (
  item_id: string
) => {
  return `/reclaims/${item_id}`
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps>

const Reclaims: FC<ReduxType> = ({
  items,
  loading
}) => {

  const history = useHistory()

  if (
    loading &&
    items.length === 0
  ) {
    return <Loader size='large' />
  }

  if (items.length === 0) {
    return <>
      <InitialNote
        title='Create Your First Web2 Retrodrop'
        text="Start new Web2 Retrodrop campaign to distribute your tokens"
        onClick={() => {
          history.push('/reclaims/new')
        }}
        buttontText='New Web2 Retrodrop'
      />
    </>
  }

  const itemsToShow = items.filter(item => item.reclaim)

  return <Container>
    <WidgetComponent>
      <Header>
        <WidgetTitleStyled>
          Web2 Retrodrops
          <Tooltip position='right' text='Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol. Learn more at https://www.reclaimprotocol.org/'>
            <Icons.InformationIcon />
          </Tooltip>
        </WidgetTitleStyled>
        <ContainerButton
          title='+ New'

          disabled={loading}
          size='extra-small'
          appearance='action'
          onClick={() => {
            history.push('/reclaims/new')
          }}
        />
      </Header>
      {itemsToShow.length > 0 && <DispensersListStyled>
        <BatchListLabel>Created</BatchListLabel>
        <BatchListLabel>Start date</BatchListLabel>
        <BatchListLabel>Name</BatchListLabel>
        <BatchListLabel>Links</BatchListLabel>
        <BatchListLabel>Scans</BatchListLabel>
        <BatchListLabel>Claims</BatchListLabel>
        <BatchListLabel>Status</BatchListLabel>
        <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>
        
        {itemsToShow.map(reclaim => {
          return createReclaimRow(reclaim)
        })}
      </DispensersListStyled>}
    </WidgetComponent>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps)(Reclaims)

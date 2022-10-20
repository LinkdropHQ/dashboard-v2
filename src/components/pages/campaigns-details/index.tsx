import { FC, useEffect } from 'react'
import { RootState } from 'data/store';
import { connect } from 'react-redux';
import { Loader } from 'components/common'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  WidgetComponent,
  Container,
  WidgetButton,
  BatchList,
  BatchTitle
} from './styled-components'
import { downloadLinksAsCSV } from 'helpers'
import { useHistory } from 'react-router-dom'
import { getCampaignBatches } from 'data/store/reducers/campaigns/async-actions'
import {
  formatDate,
  decryptLinks
} from 'helpers'
import { IProps } from './types'
import { IAppDispatch } from 'data/store'

const mapStateToProps = ({
  campaigns: { campaigns, loading },
  user: { address, dashboardKey },
  campaign: { decimals },
}: RootState) => ({
  campaigns,
  address,
  decimals,
  loading,
  dashboardKey
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    getCampaignBatches: (campaign_id: string | number) => {
      dispatch(
        getCampaignBatches({ campaign_id })
      )
    }
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignDetails: FC<ReduxType & IProps & RouteComponentProps> = (props) => {
  const { campaigns, dashboardKey, match: { params }, getCampaignBatches, loading } = props
  const history = useHistory()
  useEffect(() => {
    getCampaignBatches(params.id)
  }, [])

  const currentCampaign = campaigns.find(campaign => campaign.campaign_id === params.id)
  if (!currentCampaign) {
    return null
  }
  const { campaign_id, token_standard, title, batches, created_at } = currentCampaign
    
  return <Container>
    <WidgetComponent title={title || `Campaign ${campaign_id}`}>
      {loading && <Loader withOverlay />}
      <BatchList>
        {batches && batches.map(batch => {
          const dateFormatted = formatDate(batch.created_at || '')
          return <>
            <BatchTitle>
            {batch.batch_description} / {batch.claim_links.length} link(s). Created {dateFormatted} {batch.sponsored ? '(sponsored)' : ''}
            </BatchTitle>
            <WidgetButton
              appearance='action'
              title='Download CSV'
              onClick={() => {
                if (!dashboardKey) { return alert ('dashboardKey is not provided') }
                const decryptedLinks = decryptLinks(batch.claim_links, dashboardKey)
                downloadLinksAsCSV(
                  decryptedLinks,
                  title,
                  batch.created_at || ''
                )
              }}
            />
          </>
        })}
      </BatchList>
      <WidgetButton
        appearance='action'
        title='+ Add more links'
        onClick={() => {
          history.push(`/campaigns/edit/${token_standard}/${campaign_id}/initial`)
        }}
      />
    </WidgetComponent>
  </Container>
}

export default withRouter(connect(mapStateToProps, mapDispatcherToProps)(CampaignDetails))

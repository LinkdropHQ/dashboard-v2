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
import { useHistory } from 'react-router-dom'
import { getCampaignBatches, downloadLinks } from 'data/store/reducers/campaigns/async-actions'
import {
  formatDate
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
    },
    downloadLinks: (batch_id: string | number, campaign_id: string | number, title: string) => {
      dispatch(
        downloadLinks(batch_id, campaign_id, title)
      )
    }
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignDetails: FC<ReduxType & IProps & RouteComponentProps> = (props) => {
  const { campaigns, dashboardKey, match: { params }, getCampaignBatches, loading, downloadLinks } = props
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
            {batch.batch_description} / {batch.claim_links_count} link(s). Created {dateFormatted} {batch.sponsored ? '(sponsored)' : ''}
            </BatchTitle>
            <WidgetButton
              appearance='action'
              title='Download CSV'
              onClick={() => {
                return downloadLinks(batch.batch_id, campaign_id, title)
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

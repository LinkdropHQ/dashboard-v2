import { FC, useEffect } from 'react'
import { RootState } from 'data/store';
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  TRouterURLParams,
  TClaimPattern,
  TCollection
} from 'types'
import { useHistory } from 'react-router-dom'
import { IAppDispatch } from 'data/store'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import {
  Container,
} from 'components/pages/common'
import { preventPageClose } from 'helpers'

const mapStateToProps = ({
  campaigns: {
    campaigns
  },
  campaign: {
    tokenStandard,
    tokenAddress
  },
  collections: {
    collections
  }
}: RootState) => ({
  campaigns,
  tokenStandard,
  tokenAddress,
  collections
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    applyClaimPattern:(
      claimPattern: TClaimPattern,
      isNewCampaign: boolean,
      callback: () => void
    ) => dispatch(
      campaignAsyncActions.applyClaimPattern(
        claimPattern,
        isNewCampaign,
        callback
      )
    )
  }
}

const defineClaimPattern = (
  collections: TCollection[],
  tokenAddress: string
) => {
  const isLinkdropCollection = collections.find(collection => {
    return collection.token_address?.toLowerCase() === tokenAddress.toLowerCase()
  })

  if (isLinkdropCollection) {
    return 'mint'
  }

  return 'transfer'
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignsCreateInitial: FC<ReduxType> = ({
  campaigns,
  tokenStandard,
  applyClaimPattern,
  tokenAddress,
  collections
}) => {
  const { type, id } = useParams<TRouterURLParams>()
  const campaign = id ? campaigns.find(campaign => campaign.campaign_id === id) : null

  const history = useHistory()
  useEffect(preventPageClose(), [])

  const nextStepAction = () => {
    const claimPattern = defineClaimPattern(
      collections,
      tokenAddress as string
    )
    applyClaimPattern(
      claimPattern,
      !Boolean(id),
      () => {
        // if (tokenAddress === NATIVE_TOKEN_ADDRESS) {
        //   if (currentCampaign) {
        //     return history.push(`/campaigns/edit/${type}/${currentCampaign.campaign_id}/secure`)
        //   }
        //   return history.push(`/campaigns/new/${type}/secure`)
        // }
        if (campaign) {
          return history.push(`/campaigns/edit/${type}/${campaign.campaign_id}/approve`)
        }
        history.push(`/campaigns/new/${type}/approve`)
      }
    )
  }

  useEffect(() => {
    nextStepAction()
  }, [])

  return <Container>
    
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsCreateInitial)

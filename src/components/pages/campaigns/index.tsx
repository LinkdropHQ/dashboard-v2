import { FC, useState } from 'react'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { Loader, TextLink } from 'components/common'
import {
  TCampaignCreateStep,
  TTokenType
} from 'types'
import {
  DraftsListStyled,
  CampaignsListStyled,
  Header,
  WidgetTitleStyled,
  ContainerButton,
  ButtonStyled,
  BatchListValueFixed,
  WidgetComponentStyled,
  TagStyled,
  BatchListLabelTextAlignRight,
  BatchListValueJustifySelfEnd,
  Buttons,
  LoaderContainer
} from './styled-components'
import {
  BatchListLabel,
  BatchListValue,
  InitialNote
} from 'components/pages/common'
import {
  TProps
} from './types'
import {
  formatDate,
  shortenString,
  defineExplorerUrl
} from 'helpers'
import Icons from 'icons'
import { useHistory } from 'react-router-dom'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import * as campaignsAsyncActions from 'data/store/reducers/campaigns/async-actions'
import { NewCampaign } from './components'

const defineCampaignStatus = (
  draft: boolean,
) => {
  if (draft) {
    return <TagStyled
      status='default'
      title='Draft'
    />
  }

  return <TagStyled
  status='success'
    title='Active'
  />
}

const defineDraftUrl = (
  createStep: TCampaignCreateStep,
  tokenStandard: TTokenType
) => {
  switch (createStep) {
    case 'approve':
      return `/campaigns/new/${tokenStandard}/approve`
    case 'secure':
      return `/campaigns/new/${tokenStandard}/secure`
    case 'initial':
      return `/campaigns/new/${tokenStandard}/initial`
    default:
      return `/campaigns/new`
  }
}

const mapStateToProps = ({
  campaigns: {
    campaigns,
    drafts,
    loading
  },
  user: {
    address,
    chainId,
    loading: userLoading
  },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  loading,
  drafts,
  userLoading
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    openDraft: (
      id: string,
      callback: () => void
    ) => {
      dispatch(
        campaignAsyncActions.openDraft(
          id,
          callback
        )
      )
    },
    deleteDraft: (
      id: string
    ) => {
      dispatch(
        campaignsAsyncActions.removeCampaignFromDrafts(
          id
        )
      )
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignsPage: FC<ReduxType & TProps> = ({
  campaigns,
  address,
  loading,
  drafts,
  chainId,
  deleteDraft,
  openDraft,
  userLoading
}) => {

  const currentAddressCampaigns = campaigns.filter(campaign => {
    return campaign.creator_address.toLocaleLowerCase() === address.toLocaleLowerCase()
  })

  const history = useHistory()

  const [ newCampaignPopup, setNewCampaignPopup ] = useState(false)

  // @ts-ignore
  const currentAddressDrafts = drafts.filter(draft => {
    return draft.creatorAddress.toLocaleLowerCase() === address.toLocaleLowerCase() && draft.chainId === chainId
  })

  if (
    loading &&
    currentAddressCampaigns.length === 0 &&
    currentAddressDrafts.length === 0
  ) {
    return <LoaderContainer>
      <Loader size='large' />
    </LoaderContainer>
  }

  if (
    currentAddressCampaigns.length === 0 &&
    currentAddressDrafts.length === 0
  ) {
    return <InitialNote
      title='Create Your First Campaign'
      text="Your campaigns will be displayed here once created. You don't have any campaigns yet"
      href='/campaigns/new'
      buttontText='New Campaign'
    />
  }

  return <>
    <WidgetComponentStyled>
      {newCampaignPopup && <NewCampaign onClose={() => setNewCampaignPopup(false)} />}
      <Header>
        <WidgetTitleStyled>Claim links</WidgetTitleStyled>
        <ContainerButton
          title='+ New'
          disabled={userLoading}
          size='extra-small'
          appearance='action'
          onClick={() => setNewCampaignPopup(true)}
        />
      </Header>
      {currentAddressCampaigns && currentAddressCampaigns.length > 0 && <CampaignsListStyled>
        <BatchListLabel>Created</BatchListLabel>
        <BatchListLabel>Name</BatchListLabel>
        <BatchListLabel>Token</BatchListLabel>
        <BatchListLabel>Links</BatchListLabel>
        <BatchListLabel>Claims</BatchListLabel>
        <BatchListLabel>Status</BatchListLabel>
        <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>
      {currentAddressCampaigns.map(campaign => {
        const {
          title,
          created_at,
          campaign_id,
          chain_id,
          sponsored,
          links_count,
          token_address,
          links_claimed
        } = campaign
        const scanUrl = defineExplorerUrl(Number(chain_id), `/address/${token_address}`)

        const dateCreatedFormatted = formatDate(created_at || '')
        return <>
          <BatchListValue>
            {dateCreatedFormatted}
          </BatchListValue>
          <BatchListValueFixed>{title}</BatchListValueFixed>
          <BatchListValue>
            <TextLink href={scanUrl as string} target='_blank'>
              {shortenString(token_address as string)}
            </TextLink>
          </BatchListValue>
          <BatchListValue>
            {links_count || 0}
          </BatchListValue>
          <BatchListValue>
            {sponsored ? (links_claimed || 0) : 'N/A'}
          </BatchListValue>
          <BatchListValue>
            {defineCampaignStatus(false)}
          </BatchListValue>
          <BatchListValueJustifySelfEnd>
            <ButtonStyled
              appearance='additional'
              size='extra-small'
              to={`/campaigns/${campaign_id}`}
            >
              Manage
            </ButtonStyled>
          </BatchListValueJustifySelfEnd>
        </>})}
      </CampaignsListStyled>}
    </WidgetComponentStyled>


    {currentAddressDrafts && currentAddressDrafts.length > 0 && <WidgetComponentStyled>
      <Header>
        <WidgetTitleStyled>Drafts</WidgetTitleStyled>
      </Header>
      <DraftsListStyled>
        <BatchListLabel>Created</BatchListLabel>
        <BatchListLabel>Name</BatchListLabel>
        <BatchListLabel>Token</BatchListLabel>
        <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>
        {currentAddressDrafts.map(campaign => {
        const {
          id,
          campaign: campaignData,
          step,
          chainId,
          createdAt
        } = campaign
        const scanUrl = defineExplorerUrl(Number(chainId), `/address/${campaignData.tokenAddress}`)

        const dateCreatedFormatted = formatDate(createdAt || '')
        return <>
          <BatchListValue>
            {dateCreatedFormatted}
          </BatchListValue>
          <BatchListValueFixed>{campaignData.title}</BatchListValueFixed>
          <BatchListValue>
            <TextLink href={scanUrl as string} target='_blank'>
              {shortenString(campaignData.tokenAddress as string)}
            </TextLink>
          </BatchListValue>
          <BatchListValue>
            <Buttons>
              <ButtonStyled
                appearance='additional'
                size='extra-small'
                onClick={() => {
                  const url = defineDraftUrl(
                    step,
                    campaignData.tokenStandard as TTokenType
                  )


                  openDraft(
                    String(id),
                    () => history.push(url)
                  )
                }}
              >
                Continue
              </ButtonStyled>

              <ButtonStyled
                appearance='additional'
                size='extra-small'
                onClick={() => {
                  deleteDraft(id as string)
                }}
              >
                <Icons.TrashIcon />
              </ButtonStyled>
            </Buttons>
            

          </BatchListValue>
        </>})}
      </DraftsListStyled>

    </WidgetComponentStyled>}
    
    
  </>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsPage)

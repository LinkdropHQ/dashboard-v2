import { FC, useState } from 'react'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import { Loader } from 'components/common'
import {
  TCampaign
} from 'types'
import {
  Header,
  WidgetTitleStyled,
  ContainerButton,
  WidgetComponentStyled,
  LoaderContainer
} from './styled-components'
import {
  InitialNote
} from 'components/pages/common'
import {
  TProps,
  TCampaignsType
} from './types'
import { CreateCampaign } from './components'
import {
  CampaignsItems,
  Drafts,
  Tabs
} from './components'

const mapStateToProps = ({
  campaigns: {
    campaigns,
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
  userLoading
})

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps>

const getActiveCampaigns = (
  campaigns: TCampaign[]
) => {
  return <CampaignsItems
    campaigns={campaigns}
  />
}

const getDrafts = (
  drafts: TCampaign[]
) => {
  return <Drafts
    drafts={drafts}
  />
}

const CampaignsPage: FC<ReduxType & TProps> = ({
  campaigns,
  address,
  loading,
  chainId,
  userLoading
}) => {

  const [
    campagnsType,
    setCampagnsType
  ] = useState<TCampaignsType>('ACTIVE')

  const currentAddressCampaigns = campaigns.filter(campaign => {
    return (campaign.creator_address.toLocaleLowerCase() === address.toLocaleLowerCase()) && !campaign.draft
  })

  const [ newCampaignPopup, setNewCampaignPopup ] = useState(false)

  // @ts-ignore
  const currentAddressDrafts = campaigns.filter(campaign => {
    return campaign.draft
  })

  const defineContent = () => {
    switch (campagnsType) {
      case 'ACTIVE':
        return getActiveCampaigns(currentAddressCampaigns.filter(campaign => !campaign.archived))
      case 'ARCHIVED':
        return getActiveCampaigns(currentAddressCampaigns.filter(campaign => campaign.archived))
      case 'DRAFTS':
        return getDrafts(
          currentAddressDrafts
        )
    }
  }

  if (
    loading &&
    currentAddressCampaigns.length === 0
  ) {
    return <LoaderContainer>
      <Loader size='large' />
    </LoaderContainer>
  }

  if (
    currentAddressCampaigns.length === 0 &&
    currentAddressDrafts.length === 0
  ) {
    return <>
      <InitialNote
        title='Create Your First Campaign'
        text="Your campaigns will be displayed here once created. You don't have any campaigns yet"
        onClick={() => {setNewCampaignPopup(true)}}
        buttontText='New Campaign'
      />
      {newCampaignPopup && <CreateCampaign onClose={() => setNewCampaignPopup(false)} />}
    </>
  }

  return <>
    <WidgetComponentStyled>
      {newCampaignPopup && <CreateCampaign onClose={() => setNewCampaignPopup(false)} />}
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

      <Tabs
        setCampagnsType={setCampagnsType}
        activeTab={campagnsType}
      />

      {defineContent()}
    </WidgetComponentStyled>
  </>
}

// @ts-ignore
export default connect(mapStateToProps)(CampaignsPage)

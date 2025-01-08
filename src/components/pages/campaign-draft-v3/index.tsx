import { FC, useState } from 'react'
import {
  TStep
} from './types'
import {
  Container,
  ButtonStyled,
  Content
} from './styled-components'
import {
  ChooseContractAside,
  SetERC20LinksAside,
  DistributionWidget,
  ClaimLinksWidget,
  Aside
} from './components'
import {
  TRouterURLParams
} from 'types'
import {
  Redirect,
  useParams
} from 'react-router-dom'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'

const mapStateToProps = ({
  campaigns: {
    campaigns
  }
}: RootState) => ({
  campaigns
})


const definePopup = (
  currentStep: TStep | null,
  setCurrentStep: (currentStep: TStep | null) => void
) => {
  switch (
    currentStep
  ) {
    case 'choose_contract':
      return <ChooseContractAside
        setCurrentStep={setCurrentStep}
      />
    case 'set_erc20_links':
      return <SetERC20LinksAside
      setCurrentStep={setCurrentStep}
    />
    
    default:
      return null
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps>

const CampaignDraft: FC<ReduxType> = ({
  campaigns
}) => {
  const [
    currentStep,
    setCurrentStep
  ] = useState<TStep | null>('choose_contract')

  const { type, id } = useParams<TRouterURLParams>()
  const currentCampaign = campaigns.find(campaign => campaign.campaign_id === id)
  if (!currentCampaign) {
    return <Redirect to='campaigns' />
  }
  return <Container>
    <Content>
      <ClaimLinksWidget
        setCurrentStep={setCurrentStep}
      />

      <DistributionWidget
        setCurrentStep={setCurrentStep}
      />
    </Content>

    <Aside
      title={currentCampaign.title}
      draft={currentCampaign.draft}
      token={currentCampaign.token_address}
      distributionMethod={currentCampaign.distribution_method}
    />


    
    {
      definePopup(
        currentStep,
        setCurrentStep
      )
    }
  </Container>
}

export default connect(mapStateToProps)(CampaignDraft)
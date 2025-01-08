import { FC, useState } from 'react'
import {
  TStep
} from './types'
import {
  Container,
  Content
} from './styled-components'
import {
  ChooseContractAside,
  SetERC20LinksAside,
  DistributionWidget,
  ClaimLinksWidget,
  Aside,
  SetQRSet,
  ClaimAppSettings
} from './components'
import {
  TRouterURLParams
} from 'types'
import {
  Redirect,
  useParams
} from 'react-router-dom'
import { RootState } from 'data/store'
import {
  NewDispenserPopup
} from 'components/pages/common'
import { connect } from 'react-redux'
import Icons from 'icons'

const mapStateToProps = ({
  campaigns: {
    campaigns
  }
}: RootState) => ({
  campaigns
})

const defineDistributionMethods = (
  setCurrentStep: (currentStep: TStep) => void
) => {
  return [
    {
      title: 'Dynamic QR for electronic displays',
      text: 'A web page with an auto-refresh QR code that updates in real time. This ensures secure distribution, preventing a single user from claiming all tokens',
      onClick: () => {
        
      },
      image: <Icons.DynamicQRPreviewIcon />
    }, {
      title: 'Printable Dispenser QR code',
      text: 'A single QR code that dispenses tokens one-by-one to users after they scan it. Ideal for controlled and sequential token distribution',
      onClick: () => {
        
      },
      image: <Icons.DispenserQRPreviewIcon />
    }, {
      title: 'Printable Set of QR codes',
      text: 'A set of single-claim QR codes. Each QR code is valid for one claim only, and becomes invalid after being scanned and claimed by a user',
      onClick: () => {
        setCurrentStep('set_qr-set')
      },
      image: <Icons.QRSetPreviewIcon />
    }
  ]
}



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
    
    case 'choose_distribution_method':
      return <NewDispenserPopup
        dispenserOptions={defineDistributionMethods(setCurrentStep)}
        title='Create QR campaign'
        subtitle='Start new QR campaign to distribute your tokens by choosing the method that best suits your needs:'
        onClose={() => {
          setCurrentStep(null)
        }}
      />
    
    case 'set_qr-set':
      return <SetQRSet
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
  ] = useState<TStep | null>(null)

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

      <ClaimAppSettings
        campaign={currentCampaign}
      />
    </Content>

    <Aside
      title={currentCampaign.title}
      draft={currentCampaign.draft}
      token={currentCampaign.token_address}
      chainId={currentCampaign.chain_id}
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
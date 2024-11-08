import { FC, useEffect, useState } from 'react'
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
  ClaimAppSettings,
  LaunchProcessPopup
} from './components'
import {
  TRouterURLParams,
  TTokenType
} from 'types'
import {
  Redirect,
  useParams
} from 'react-router-dom'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { RootState, IAppDispatch } from 'data/store'
import {
  NewDispenserPopup,
  LaunchPopup
} from 'components/pages/common'
import { connect } from 'react-redux'
import Icons from 'icons'

const mapStateToProps = ({
  campaigns: {
    campaigns
  },
  campaign: {
    decimals,
    symbol,
    links
  }
}: RootState) => ({
  campaigns,
  decimals,
  symbol,
  links
})


const defineDistributionMethods = (
  setCurrentStep: (currentStep: TStep) => void,
  addClaimLinksMethod: () => void,
) => {
  return [
    {
      title: 'Claim links',
      text: 'A set of simple URLs with wrapped tokens, ready to be distributed via messengers and emails. Each link allows a user to claim their tokens easily',
      onClick: () => {
        addClaimLinksMethod()
      },
      image: <Icons.DistributionClaimLinksIcon />
    }, {
      title: 'Dynamic QR',
      text: 'A web page with an auto-refresh QR code that updates in real time. This ensures secure distribution, preventing a single user from claiming all tokens',
      onClick: () => {
        
      },
      image: <Icons.DistributionDynamicIcon />
    }, {
      title: 'Dispenser QR',
      text: 'A single QR code that dispenses tokens one-by-one to users after they scan it. Ideal for controlled and sequential token distribution',
      onClick: () => {
        
      },
      image: <Icons.DistributionDispenserIcon />
    }, {
      title: 'QR Set',
      text: 'A set of single-claim QR codes. Each QR code is valid for one claim only, and becomes invalid after being scanned and claimed by a user',
      onClick: () => {
        setCurrentStep('set_qr-set')
      },
      image: <Icons.DistributionQRSetIcon />
    }
  ]
}

const definePopup = (
  currentStep: TStep | null,
  setCurrentStep: (currentStep: TStep | null) => void,
  campaignId: string,
  addClaimLinksMethod: () => void
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
        dispenserOptions={
          defineDistributionMethods(
            setCurrentStep,
            addClaimLinksMethod
          )
        }
        title='New campaign'
        subtitle='Start new campaign to distribute your tokens by choosing the method that best suits your needs:'
        onClose={() => {
          setCurrentStep(null)
        }}
      />
    
    case 'set_qr-set':
      return <SetQRSet
        setCurrentStep={setCurrentStep}
      />
    
    case 'launch':
      return <LaunchProcessPopup
        title='Generating claim links...'
        campaignId={campaignId}
        text='Distribute 10 USDC in each of the 100 claims'
        onClose={() => setCurrentStep(null)}
      />
    
    default:
      return null
  }
}

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    // @ts-ignore
    addClaimLinksMethod: (
      campaignId: string,
      callback: () => void
    ) => {
      dispatch(
        campaignAsyncActions.addClaimLinksMethod({
          campaignId,
          successCallback: callback
        })
      )
    },
    getCampaignData: (
      campaignId: string,
    ) => {
      dispatch(
        campaignAsyncActions.getCampaignData({
          campaign_id: campaignId,
          callback: async () => {}
        })
      )
    },
    getTokenContractData: (
      tokenAddress: string,
      tokenType: TTokenType
    ) => {
      dispatch(
        campaignAsyncActions.setTokenContractData(
          tokenAddress,
          tokenType
        )
      )
    },
    launch: (
      campaignId: string,
      proxyContractAddress: string,
      callback: () => void
    ) => {
      dispatch(
        campaignAsyncActions.launch(
          campaignId,
          proxyContractAddress,
          callback
        )
      )
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> &
                 ReturnType<typeof mapStateToProps>

const CampaignDraft: FC<ReduxType> = ({
  campaigns,
  addClaimLinksMethod,
  getTokenContractData,
  decimals,
  symbol,
  links,
  launch,
  getCampaignData
}) => {
  const [
    currentStep,
    setCurrentStep
  ] = useState<TStep | null>(null)

  const { type, id } = useParams<TRouterURLParams>()

  // @ts-ignore
  const currentCampaign = campaigns.find(campaign => campaign.campaign_id === id)

  useEffect(() => {
    
    getCampaignData(id)
  }, [])

  useEffect(() => {
    if (
      currentCampaign &&
      currentCampaign.token_address &&
      currentCampaign.token_standard
    ) {
      // @ts-ignore
      getTokenContractData(
        currentCampaign.token_address,
        currentCampaign.token_standard
      )
    }
  }, [
    currentCampaign?.token_address
  ])

  // useEffect(() => {
  //   if (
  //     currentCampaign &&
  //     decimals &&
  //     symbol &&
  //     links.length > 0
  //   ) {
  //     // @ts-ignore
      
  //   }
  // }, [
  //   currentCampaign?.token_address,
  //   links,
  //   //
  //   decimals,
  //   symbol
  // ])




  if (!currentCampaign) {
    return <Redirect to='campaigns' />
  }

  return <Container>
    <Content>
      <ClaimLinksWidget
        setCurrentStep={setCurrentStep}
        links={links}
        decimals={decimals}
      />

      <DistributionWidget
        setCurrentStep={setCurrentStep}
        distributionMethod={currentCampaign.distribution_method}
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
      launch={() => {
        setCurrentStep('launch')
        launch(
          id,
          currentCampaign.proxy_contract_address,
          () => {
            setCurrentStep(null)
          }
        )
      }}
      distributionMethod={currentCampaign.distribution_method}
    />
    
    {
      definePopup(
        currentStep,
        setCurrentStep,
        id,
        // @ts-ignore
        () => addClaimLinksMethod(
          currentCampaign.campaign_id,
          () => setCurrentStep(null)
        )
      )
    }
  </Container>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(CampaignDraft)
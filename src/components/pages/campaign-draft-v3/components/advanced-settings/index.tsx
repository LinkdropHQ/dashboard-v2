import {
  FC,
  useState
} from 'react'
import {
  TProps,
  TSettingsData
} from './types'
import {
  TCountry
} from 'types'
import * as CommonComponents from 'components/pages/common'
import {
  updateAdditionalSettings
} from 'data/store/reducers/campaign/async-actions'
import {
  ExpandableWidget
} from 'components/common'
import { connect } from 'react-redux'
import { RootState, IAppDispatch } from 'data/store'
import {
  ButtonsContainer,
  ButtonStyled
} from '../../styled-components'

const mapStateToProps = ({
  campaigns: {
    campaigns,
    loading
  },
  user: {
    address,
    dashboardKey,
    signer,
    jsonRPCProvider,
    chainId,
    countries
  },
  campaign: {
    decimals,
    loading: campaignLoading
  },
}: RootState) => ({
  campaigns,
  address,
  countries,
  decimals,
  campaignLoading,
  loading,
  dashboardKey,
  signer,
  provider: jsonRPCProvider,
  chainId
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    updateSettings: (campaign_id: string, data: TSettingsData, actionCallback?: (campaignId: string) => void) => {
      dispatch(
        updateAdditionalSettings({
          ...data,
          campaign_id,
          actionCallback
        })
      )
    }
  }
}
// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> & TProps

const AdvancedSettings: FC<ReduxType> = ({
  campaign,
  loading,
  countries,
  updateSettings
}) => {

  const {
    additional_wallets_on,
    preferred_wallet_on,
    wallet,
    claim_host,
    campaign_id,
    available_countries_on,
    claiming_finished_button_on,
    claim_host_on,
    multiple_claims_on,
    claiming_finished_button_url,
    claiming_finished_button_title,
    available_countries,
    claiming_finished_auto_redirect
    // @ts-ignore
  } = campaign

  const defaultSettings = {
    additional_wallets_on,
    preferred_wallet_on,
    wallet,
    claim_host,
    available_countries_on,
    claiming_finished_button_on,
    claim_host_on,
    multiple_claims_on,
    claiming_finished_button_url,
    claiming_finished_button_title,
    available_countries,
    claiming_finished_auto_redirect
  }

  const [ settingsData, setSettingsData ] = useState<TSettingsData>(defaultSettings)

  return <ExpandableWidget
    title='Advanced settings'
    description={
      <span></span>
    }
  >
    <CommonComponents.AdvancedSettings
      // @ts-ignore
      loading={loading}
      countries={countries}
      campaignData={campaign}
      availableCountriesValue={settingsData.available_countries.map((currentCountry) => {
        const country = countries.find(country => country.id === currentCountry)
        return country
      }).filter(item => item) as TCountry[]}

      customClaimHostValue={settingsData.claim_host}

      customClaimHostSubmit={(
        claimHost
      ) => {
        setSettingsData({
          ...settingsData, claim_host: claimHost
        })
      }}
      customClaimHostOnToggleValue={Boolean(settingsData.claim_host_on)}
      customClaimHostOnToggleAction={(value) => {
        setSettingsData({
          ...settingsData, claim_host_on: value
        })
      }}
      multipleClaimsOnToggleAction={(value) => {
        setSettingsData({
          ...settingsData, multiple_claims_on: value
        })
      }}
      multipleClaimsOnToggleValue={Boolean(settingsData.multiple_claims_on)}

      availableCountriesSubmit={(
        value,
      ) => {
        setSettingsData({
          ...settingsData, available_countries: value
        })
      }}

      availableCountriesToggleAction={(value) => {
        setSettingsData({
          ...settingsData,
          available_countries_on: value
        })
      }}

      availableCountriesToggleValue={Boolean(settingsData.available_countries_on)}
    />

  
    <ButtonsContainer>
      <ButtonStyled
        appearance='action'
        onClick={() => {
          
        }}
      >
        Apply
      </ButtonStyled>
      <ButtonStyled
        onClick={() => {
          
        }}
      >
        Cancel
      </ButtonStyled>
    </ButtonsContainer>
  </ExpandableWidget>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(AdvancedSettings)
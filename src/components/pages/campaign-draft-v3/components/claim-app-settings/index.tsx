import {
  FC
} from 'react'
import {
  TProps
} from './types'
import {
  TCountry
} from 'types'
import * as CommonComponents from 'components/pages/common'
import {
  getCampaignBatches,
  downloadLinks,
  downloadReport,
  updateAvailableCountriesOn,
  updateClaimingFinishedButtonOn,
  updateClaimingFinishedButton,
  updateAvailableCountries,
  updateWallets,
  updatePreferredWalletOn,
  updateClaimHost,
  updateClaimHostOn,
  updateMultipleClaimsOn
} from 'data/store/reducers/campaigns/async-actions'
import { connect } from 'react-redux'
import { RootState, IAppDispatch } from 'data/store'

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
    updateAvailableCountriesOn: (
      campaign_id: string,
      available_countries_on: boolean
    ) => {
      dispatch(
        updateAvailableCountriesOn(
          campaign_id,
          available_countries_on
        )
      )
    },

    updatePreferredWalletOn: (
      campaign_id: string,
      preferred_wallet_on: boolean
    ) => {
      dispatch(
        updatePreferredWalletOn(
          campaign_id,
          preferred_wallet_on
        )
      )
    },

    updateAvailableCountries: (
      campaign_id: string,
      available_countries: string[],
      callback?: () => void
    ) => {
      dispatch(
        updateAvailableCountries(
          campaign_id,
          available_countries,
          callback
        )
      )
    },

    updateWallet: (
      campaign_id: string,
      wallet: string,
      additional_wallets_on: boolean,
      callback?: () => void
    ) => {
      dispatch(
        updateWallets(
          campaign_id,
          wallet,
          additional_wallets_on,
          callback
        )
      )
    },

    updateClaimingFinishedButtonOn: (
      campaign_id: string,
      claiming_finished_button_on: boolean
    ) => {
      dispatch(
        updateClaimingFinishedButtonOn(
          campaign_id,
          claiming_finished_button_on
        )
      )
    },

    updateClaimingFinishedButton: (
      campaign_id: string,
      claiming_finished_button_title: string,
      claiming_finished_button_href: string,
      callback?: () => void
    ) => {
      dispatch(
        updateClaimingFinishedButton(
          campaign_id,
          claiming_finished_button_title,
          claiming_finished_button_href,
          callback
        )
      )
    },

    updateClaimHost: (
      campaign_id: string,
      claim_host: string,
      callback?: () => void
    ) => {
      dispatch(
        updateClaimHost(
          campaign_id,
          claim_host,
          callback
        )
      )
    },

    updateClaimHostOn: (
      campaign_id: string,
      claim_host_on: boolean,
    ) => {
      dispatch(
        updateClaimHostOn(
          campaign_id,
          claim_host_on
        )
      )
    },

    updateMultipleClaimsOn: (
      campaign_id: string,
      multiple_claims_on: boolean,
    ) => {
      dispatch(
        updateMultipleClaimsOn(
          campaign_id,
          multiple_claims_on
        )
      )
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> & TProps

const ClaimAppSettings: FC<ReduxType> = ({
  campaign,
  updateWallet,
  updatePreferredWalletOn,
  updateMultipleClaimsOn,
  updateClaimHostOn,
  updateClaimHost,
  updateClaimingFinishedButtonOn,
  updateClaimingFinishedButton,
  updateAvailableCountriesOn,
  updateAvailableCountries,
  loading,
  countries
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
    available_countries
  } = campaign

  return <CommonComponents.ClaimAppSettings
    loading={loading}
    countries={countries}
    campaignData={campaign}
    additionalWalletsOnValue={Boolean(additional_wallets_on)}
    availableCountriesValue={available_countries.map((currentCountry) => {
      const country = countries.find(country => country.id === currentCountry)
      return country
    }).filter(item => item) as TCountry[]}
    preferredWalletValue={wallet}
    preferredWalletToggleValue={preferred_wallet_on}

    customClaimHostValue={claim_host}

    customClaimHostSubmit={(
      claimHost,
      onSuccess,
      onError,
    ) => {
      updateClaimHost(
        campaign_id,
        claimHost,
        onSuccess,
      )
    }}
    customClaimHostOnToggleValue={claim_host_on}
    customClaimHostOnToggleAction={(value) => {
      updateClaimHostOn(campaign_id, value)
    }}
    multipleClaimsOnToggleAction={(value) => {
      updateMultipleClaimsOn(campaign_id, value)
    }}
    multipleClaimsOnToggleValue={multiple_claims_on}

    availableCountriesSubmit={(
      value,
      onSuccess,
      onError
    ) => {
      updateAvailableCountries(
        campaign_id,
        value,
        onSuccess
      )
    }}

    walletsSubmit={(
      wallet,
      additionalWalletsOn: boolean,
      onSuccess,
      onError,
    ) => {
      updateWallet(
        campaign_id,
        wallet,
        additionalWalletsOn,
        onSuccess,
      )
    }}

    finalScreenButtonSubmit={(
      buttonTitle,
      buttonHref,
      onSuccess,
      onError,
    ) => {
      updateClaimingFinishedButton(
        campaign_id,
        buttonTitle,
        buttonHref,
        onSuccess
      )
    }}

    buttonTitleValue={claiming_finished_button_title || ''}
    buttonHrefValue={claiming_finished_button_url || ''}

    finalScreenButtonToggleAction={(value) => {
      updateClaimingFinishedButtonOn(campaign_id, value)
    }}

    availableCountriesToggleAction={(value) => {
      updateAvailableCountriesOn(campaign_id, value)
    }}

    preferredWalletToggleAction={(value) => {
      updatePreferredWalletOn(campaign_id, value)
    }}

    finalScreenButtonToggleValue={claiming_finished_button_on}

    availableCountriesToggleValue={available_countries_on}
  >

  </CommonComponents.ClaimAppSettings>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(ClaimAppSettings)
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
  updateClaimAppSettings
} from 'data/store/reducers/campaign/async-actions'

import { ExpandableWidget } from 'components/common'
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
    updateSettings: (
      campaign_id: string,
      data: TSettingsData,
      actionCallback?: (campaignId: string) => void
    ) => {
      dispatch(
        updateClaimAppSettings({
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

const ClaimAppSettings: FC<ReduxType> = ({
  campaign,
  loading,
  countries,
  updateSettings
}) => {

  const {
    additional_wallets_on,
    preferred_wallet_on,
    wallet,
    campaign_id,
    claiming_finished_button_on,
    claiming_finished_button_url,
    claiming_finished_button_title,
    claiming_finished_auto_redirect
    // @ts-ignore
  } = campaign

  const defaultSettings = {
    additional_wallets_on,
    preferred_wallet_on,
    wallet,
    claiming_finished_button_on,
    claiming_finished_button_url,
    claiming_finished_button_title,
    claiming_finished_auto_redirect
  }

  const [ settingsData, setSettingsData ] = useState<TSettingsData>(defaultSettings)

  return <ExpandableWidget
    title='Claim app settings (optional)'
    description={<></>}
  >
    <CommonComponents.ClaimAppSettings
      // @ts-ignore
      loading={loading}
      campaignData={campaign}
      autoRedirectValue={claiming_finished_auto_redirect}
      additionalWalletsOnValue={Boolean(settingsData.additional_wallets_on)}
      preferredWalletValue={settingsData.wallet}
      preferredWalletToggleValue={settingsData.preferred_wallet_on}

      walletsSubmit={(
        wallet,
        additionalWalletsOn: boolean,
      ) => {
        setSettingsData({
          ...settingsData,
          wallet,
          additional_wallets_on: additionalWalletsOn
        })
      }}

      finalScreenButtonSubmit={(
        buttonTitle,
        buttonHref,
      ) => {
        setSettingsData({
          ...settingsData,
          claiming_finished_button_title: buttonTitle,
          claiming_finished_button_url: buttonHref
        })
      }}

      buttonTitleValue={settingsData.claiming_finished_button_title || ''}
      buttonHrefValue={settingsData.claiming_finished_button_url || ''}

      finalScreenButtonToggleAction={(value) => {
        setSettingsData({
          ...settingsData,
          claiming_finished_button_on: value
        })
      }}

      preferredWalletToggleAction={(value) => {
        setSettingsData({
          ...settingsData,
          preferred_wallet_on: value
        })
      }}

      finalScreenButtonToggleValue={Boolean(settingsData.claiming_finished_button_on)}
    />

    <ButtonsContainer>
      <ButtonStyled
        appearance='action'
        onClick={() => {
          updateSettings(
            campaign_id,
            settingsData,
            () => {}
          )
        }}
      >
        Apply
      </ButtonStyled>
      <ButtonStyled
        onClick={() => {
          setSettingsData(defaultSettings)
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
)(ClaimAppSettings)
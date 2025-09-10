import {
  FC,
  useState
} from 'react'
import {
  WidgetStyled,
  TableValueStyled,
  ButtonStyled,
  TableTextStyled
} from './styled-components'
import {
  TProps,
  TSettingItem
} from './types'
import {
  TableRow
} from 'components/pages/common'
import Icons from 'icons'
import { TCountry, TDispenser, TTokenType } from 'types'
import Wallets from './wallets'
import Countries from './countries'
import FinalScreenButton from './final-screen-button'
import CustomClaimHost from './custom-claim-host'
import MultipleClaims from './multiple-claims'
import wallets from 'configs/wallets'
import { Tooltip } from 'components/common'

const settings = [
  {
    title: 'Country restrictions',
    subtitle: 'If you want to make the campaign available only in certain countries, please toggle on this feature and add countries from the list below',
    id: 'available_countries',
    tooltip: 'Select which countries can claim tokens'
  }, {
    title: 'Wallet options',
    subtitle: 'Toggle this option to recommend a specific crypto wallet for users who don’t yet have one. If toggled off, the Coinbase Smart Wallet will be set as the default recommendation',
    id: 'wallets',
    tooltip: 'Display preferred wallet as primary option when claiming tokens'
  }, {
    title: 'Final screen button',
    subtitle: 'You can add a custom button to the final screen after a user claims your tokens. When clicked, it will redirect the user to the URL you specify below',
    id: 'final_screen_button',
    tooltip: 'Add a primary button to the final screen that leads to any URL'
  }, {
    title: 'Multiple claim per wallet',
    subtitle: 'Toggle this setting on to allow multiple claims to a single wallet address',
    id: 'multiple_claims',
    tooltip: 'Allow multiple claims for a single address'
  }, {
    title: 'Custom claim host',
    subtitle: 'You can specify your own domain name, and claim links will be mapped to your domain name. By the default links are hosted at https://claim.linkdrop.io',
    id: 'custom_claim_host',
    tooltip: 'You can specify your own domain name to have claim links mapped to it'
  }
]


const renderSettingItem = (
  settingItem: TSettingItem,
  enabled: boolean,
  onClick: () => void,
  enabledLabel?: string,
  disabledLabel?: string
) => {
  return <TableRow onClick={onClick}>
    <TableTextStyled>
      {settingItem.title}
      <Tooltip text={settingItem.tooltip}>
        <Icons.InformationIcon />
      </Tooltip>
    </TableTextStyled>
    <TableValueStyled>
      <ButtonStyled
        appearance='additional'
        size='extra-small'
        onClick={onClick}
      >
        {enabled ? (enabledLabel || 'On') : (disabledLabel || 'Off')}
      </ButtonStyled>      
    </TableValueStyled>
  </TableRow>
}

const definePopup = (
  setting: TSettingItem,
  loading: boolean,
  onClose: () => void,

  availableCountriesSubmit: (
    value: any,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void,

  customClaimHostSubmit: (
    claimHost: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void,

  walletsSubmit: (
    wallet: string,
    additionalWalletsOnValue: boolean,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void,


  finalScreenButtonSubmit: (
    buttonTitleValue: string,
    buttonHrefValue: string,
    autoRedirectValue: boolean,
    successAction?: () => void,
    errorAction?: () => void
  ) => void,

  availableCountriesValue: TCountry[],
  preferredWalletValue: string,
  additionalWalletsOnValue: boolean,
  buttonTitleValue: string,
  buttonHrefValue: string,
  autoRedirectValue: boolean,
  countries: TCountry[],
  customClaimHost: string,

  sposored: boolean,
  chainId: number,
  tokenType: TTokenType,

  finalScreenButtonToggleAction?: (value: boolean) => void,
  finalScreenButtonToggleValue?: boolean,
  availableCountriesToggleAction?: (value: boolean) => void,
  availableCountriesToggleValue?: boolean,

  preferredWalletOnToggleAction?: (value: boolean) => void,
  preferredWalletOnToggleValue?: boolean,

  customClaimHostOnToggleAction?: (value: boolean) => void,
  customClaimHostOnToggleValue?: boolean,

  multipleClaimsOnToggleAction?: (value: boolean) => void,
  multipleClaimsOnToggleValue?: boolean,
) => {
  switch (setting.id) {
    case 'wallets':
      return <Wallets
        {...setting}
        loading={loading}
        tokenType={tokenType}
        onClose={onClose}
        preferredWalletValue={preferredWalletValue}
        action={walletsSubmit}
        additionalWalletsOnValue={additionalWalletsOnValue}
        sponsored={sposored}
        chainId={chainId}
        toggleAction={preferredWalletOnToggleAction}
        toggleValue={preferredWalletOnToggleValue}
      />
    case 'available_countries':
      return <Countries
        {...setting}
        onClose={onClose}
        availableCountriesValue={availableCountriesValue}
        action={availableCountriesSubmit}
        countries={countries}
        toggleAction={availableCountriesToggleAction}
        toggleValue={availableCountriesToggleValue}
      />
    
    case 'final_screen_button':
      return <FinalScreenButton
        {...setting}
        onClose={onClose}
        buttonTitleValue={buttonTitleValue}
        buttonHrefValue={buttonHrefValue}
        autoRedirectValue={autoRedirectValue}
        action={finalScreenButtonSubmit}
        toggleAction={finalScreenButtonToggleAction}
        toggleValue={finalScreenButtonToggleValue}
      />

    case 'multiple_claims':
      return <MultipleClaims
        {...setting}
        onClose={onClose}
        toggleAction={multipleClaimsOnToggleAction}
        toggleValue={multipleClaimsOnToggleValue}
      />
    case 'custom_claim_host':
      return <CustomClaimHost
        {...setting}
        onClose={onClose}
        customClaimHost={customClaimHost}
        action={customClaimHostSubmit}
        toggleAction={customClaimHostOnToggleAction}
        toggleValue={customClaimHostOnToggleValue}
      />

    default: null
  }
}

const defineEnabled = (
  settingId: string,
  availableCountriesToggleValue: boolean,
  finalScreenButtonToggleValue: boolean,
  preferredWalletToggleValue: boolean,
  customClaimHostToggleValue: boolean,
  multipleClaimsToggleValue: boolean
) => {

  if (settingId === 'available_countries') {
    return availableCountriesToggleValue
  }

  if (settingId === 'final_screen_button') {
    return finalScreenButtonToggleValue
  }

  if (settingId === 'wallets') {
    return preferredWalletToggleValue
  }

  if (settingId === 'custom_claim_host') {
    return customClaimHostToggleValue
  }

  if (settingId === 'multiple_claims') {
    return multipleClaimsToggleValue
  }
  
  return false
}

const defineEnabledLabel = (
  settingId: string,
  wallet: string
) => {
  if (settingId === 'wallets') {
    const walletApp = wallets.find(walletApp =>  walletApp.id === wallet)
    if (walletApp) {
      return walletApp?.name
    }
  }

  return 'Enabled'
}


const Settings: FC<TProps> = ({
  availableCountriesSubmit,
  availableCountriesValue,

  walletsSubmit,
  preferredWalletValue,

  finalScreenButtonSubmit,
  buttonTitleValue,
  buttonHrefValue,
  autoRedirectValue,
  
  campaignData,
  loading,

  finalScreenButtonToggleAction,
  finalScreenButtonToggleValue,
  countries,
  

  availableCountriesToggleAction,
  availableCountriesToggleValue,

  customClaimHostSubmit,
  customClaimHostValue,

  preferredWalletToggleAction,
  preferredWalletToggleValue,
  customClaimHostOnToggleAction,
  customClaimHostOnToggleValue,
  additionalWalletsOnValue,
  multipleClaimsOnToggleAction,
  multipleClaimsOnToggleValue,
  
}) => {

  if (!campaignData) {
    return null
  }

  const [
    currentSetting,
    setCurrentSetting
  ] = useState<null | TSettingItem>(null)

  const popup = currentSetting ? definePopup(
    currentSetting,
    loading,
    () => setCurrentSetting(null),
    availableCountriesSubmit,
    customClaimHostSubmit,
    walletsSubmit,
    finalScreenButtonSubmit,
    availableCountriesValue,
    preferredWalletValue,
    additionalWalletsOnValue,
    buttonTitleValue,
    buttonHrefValue,
    autoRedirectValue,
    countries,
    customClaimHostValue,
    campaignData.sponsored,
    campaignData.chain_id,
    campaignData.token_standard,
    finalScreenButtonToggleAction,
    finalScreenButtonToggleValue,
    availableCountriesToggleAction,
    availableCountriesToggleValue,
    preferredWalletToggleAction,
    preferredWalletToggleValue,

    customClaimHostOnToggleAction,
    customClaimHostOnToggleValue,
  
    multipleClaimsOnToggleAction,
    multipleClaimsOnToggleValue,
  ) : null

  return <WidgetStyled title='Settings'>
    {currentSetting && null}
    {popup}
    {settings.map(setting => {

      const enabled = defineEnabled(
        setting.id,
        Boolean(availableCountriesToggleValue),
        Boolean(finalScreenButtonToggleValue),
        Boolean(preferredWalletToggleValue),
        Boolean(customClaimHostOnToggleValue),
        Boolean(multipleClaimsOnToggleValue)
      )

      const enabledLabel = defineEnabledLabel(
        setting.id,
        preferredWalletValue
      )

      if (preferredWalletValue === 'coinbase_wallet') {
        if (setting.id === 'custom_claim_host') return null
      }

      return renderSettingItem(
        setting,
        enabled,
        () => setCurrentSetting(setting),
        enabledLabel
      )})
    }
  </WidgetStyled>
}

export default Settings
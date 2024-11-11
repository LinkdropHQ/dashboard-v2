import {
  FC,
  useState
} from 'react'
import {
  TableValueStyled,
  ButtonStyled,
  TableTextStyled,
  Container
} from './styled-components'
import {
  TProps,
  TSettingItem
} from './types'
import {
  TableRow
} from 'components/pages/common'
import Icons from 'icons'
import { TCountry, TTokenType } from 'types'
import Countries from '../advanced-settings/countries'
import CustomClaimHost from '../advanced-settings/custom-claim-host'
import MultipleClaims from '../advanced-settings/multiple-claims'
import wallets from 'configs/wallets'
import { Tooltip } from 'components/common'

const settings = [
  {
    title: 'Country restrictions',
    subtitle: 'If you want to make the campaign available only in certain countries, please toggle on this feature and add countries from the list below',
    id: 'available_countries',
    tooltip: 'Select which countries can claim tokens'
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

  availableCountriesValue: TCountry[],
  countries: TCountry[],
  customClaimHost: string,

  availableCountriesToggleAction?: (value: boolean) => void,
  availableCountriesToggleValue?: boolean,

  customClaimHostOnToggleAction?: (value: boolean) => void,
  customClaimHostOnToggleValue?: boolean,

  multipleClaimsOnToggleAction?: (value: boolean) => void,
  multipleClaimsOnToggleValue?: boolean,
) => {
  switch (setting.id) {
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
  customClaimHostToggleValue: boolean,
  multipleClaimsToggleValue: boolean
) => {

  if (settingId === 'available_countries') {
    return availableCountriesToggleValue
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
) => {
  return 'Enabled'
}


const AdvancedSettings: FC<TProps> = ({
  availableCountriesSubmit,
  availableCountriesValue,
  
  campaignData,
  loading,
  countries,
  

  availableCountriesToggleAction,
  availableCountriesToggleValue,

  customClaimHostSubmit,
  customClaimHostValue,
  customClaimHostOnToggleAction,
  customClaimHostOnToggleValue,

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
    availableCountriesValue,
    countries,
    customClaimHostValue,
    availableCountriesToggleAction,
    availableCountriesToggleValue,
    customClaimHostOnToggleAction,
    customClaimHostOnToggleValue,
    multipleClaimsOnToggleAction,
    multipleClaimsOnToggleValue,
  ) : null

  return <Container>
    {currentSetting && null}
    {popup}
    {settings.map(setting => {

      const enabled = defineEnabled(
        setting.id,
        Boolean(availableCountriesToggleValue),
        Boolean(customClaimHostOnToggleValue),
        Boolean(multipleClaimsOnToggleValue)
      )

      const enabledLabel = defineEnabledLabel()

      return renderSettingItem(
        setting,
        enabled,
        () => setCurrentSetting(setting),
        enabledLabel
      )})
    }
  </Container>
}

export default AdvancedSettings
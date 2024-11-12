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
import { Tooltip } from 'components/common'
import Icons from 'icons'
import { TTokenType } from 'types'
import Wallets from './wallets'
import FinalScreenButton from './final-screen-button'
import wallets from 'configs/wallets'

const settings = [
  {
    title: 'Wallet options',
    subtitle: 'Toggle this option to recommend a specific crypto wallet for users who don’t yet have one. If toggled off, the Coinbase Smart Wallet will be set as the default recommendation',
    id: 'wallets',
    tooltip: 'Display preferred wallet as primary option when claiming tokens'
  }, {
    title: 'Final screen button',
    subtitle: 'You can add a custom button to the final screen after a user claims your tokens. When clicked, it will redirect the user to the URL you specify below',
    id: 'final_screen_button',
    tooltip: 'Add a primary button to the final screen that leads to any URL'
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

  preferredWalletValue: string,
  additionalWalletsOnValue: boolean,
  buttonTitleValue: string,
  buttonHrefValue: string,
  autoRedirectValue: boolean,

  sposored: boolean,
  chainId: number,
  tokenType: TTokenType,

  finalScreenButtonToggleAction?: (value: boolean) => void,
  finalScreenButtonToggleValue?: boolean,

  preferredWalletOnToggleAction?: (value: boolean) => void,
  preferredWalletOnToggleValue?: boolean,
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

    default: null
  }
}

const defineEnabled = (
  settingId: string,
  finalScreenButtonToggleValue: boolean,
  preferredWalletToggleValue: boolean,
) => {

  if (settingId === 'final_screen_button') {
    return finalScreenButtonToggleValue
  }

  if (settingId === 'wallets') {
    return preferredWalletToggleValue
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

  preferredWalletToggleAction,
  preferredWalletToggleValue,
  additionalWalletsOnValue,
  
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
    walletsSubmit,
    finalScreenButtonSubmit,
    preferredWalletValue,
    additionalWalletsOnValue,
    buttonTitleValue,
    buttonHrefValue,
    autoRedirectValue,
    campaignData.sponsored,
    campaignData.chain_id,
    campaignData.token_standard,
    finalScreenButtonToggleAction,
    finalScreenButtonToggleValue,
    preferredWalletToggleAction,
    preferredWalletToggleValue,
  ) : null

  return <Container>
    {currentSetting && null}
    {popup}
    {settings.map(setting => {

      const enabled = defineEnabled(
        setting.id,
        Boolean(finalScreenButtonToggleValue),
        Boolean(preferredWalletToggleValue)
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
  </Container>
}

export default Settings
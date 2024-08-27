import {
  FC,
  useState
} from 'react'
import {
  WidgetStyled,
  TableValueStyled,
  ButtonStyled,
  NoteStyled,
  TextLinkStyled,
  TableTextStyled
} from './styled-components'
import {
  TProps,
  TSettingItem
} from './types'
import { Tooltip } from 'components/common'
import {
  TableRow,
  
} from 'components/pages/common'
import Icons from 'icons'
import Timeframe from './timeframe'
import RedirectScreen from './redirect'
import Whitelist from './whitelist'
import { TDispenser } from 'types'

const settings = [
  {
    title: 'Whitelist addresses',
    subtitle: 'You can set up who can claim tokens by whitelisting users by addresses',
    id: 'whitelist',
    tooltip: 'Limit who can claim tokens by whitelisting specific addresses'
  }, {
    title: 'Timeframe',
    subtitle: 'You can set up the link expiration, so that users will not be able to claim after a certain day and time, or select \'No End Date\' to allow ongoing claims',
    id: 'timeframe',
    tooltip: 'Set an expiration date and time for the link, so users cannot claim tokens after it expires'
  }, {
    title: 'Redirect to another URL',
    subtitle: 'When your campaign is finished, existing URL could be redirected to the campaign link or any website',
    id: 'redirect',
    tooltip: 'When your campaign is finished, existing URL could be redirected to the campaign link or any website'
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
  onClose: () => void,

  redirectSubmit: (value: any, onSuccess?: () => void, onError?: () => void) => void,

  timeframeSubmit: (value: any, onSuccess?: () => void, onError?: () => void) => void,
  
  whitelistSubmit: (value: any, onSuccess?: () => void, onError?: () => void) => void,

  getDispenserWhitelist: (dispenserId: string) => void,
  loading: boolean,
  // redirect
  redirectUrl?: string | null,
  redirectToggleAction?: (value: boolean) => void,
  redirectToggleValue?: boolean,


  // whitelist
  whitelistValue?: string | null,
  whitelistToggleAction?: (value: boolean) => void,
  whitelistToggleValue?: boolean,

  timeframeToggleAction?: (value: boolean) => void,
  timeframeToggleValue?: boolean,


  campaignId?: string,
  currentDispenser?: TDispenser,
  claimUrl?: string
) => {
  switch (setting.id) {
    case 'redirect':
      return <RedirectScreen
        {...setting}
        redirectUrl={redirectUrl}
        onClose={onClose}
        claimUrl={claimUrl}
        toggleAction={redirectToggleAction}
        toggleValue={redirectToggleValue}
        action={redirectSubmit}
      />
    case 'timeframe':
      return <Timeframe
        {...setting}
        onClose={onClose}
        loading={loading}
        currentDispenser={currentDispenser}
        action={timeframeSubmit}
        toggleAction={timeframeToggleAction}
        toggleValue={timeframeToggleValue}
      />
    case 'whitelist':
      return <Whitelist
        {...setting}
        loading={loading}
        onClose={onClose}
        currentDispenser={currentDispenser}
        getDispenserWhitelist={getDispenserWhitelist}
        toggleAction={whitelistToggleAction}
        toggleValue={whitelistToggleValue}
        action={whitelistSubmit}
        whitelistValue={whitelistValue}
      />
    default: null
  }
}

const defineEnabled = (
  settingId: string,
  redirectToggleValue: boolean,
  whitelistValue: boolean,
  timeframeValue: boolean
) => {
  if (settingId === 'redirect') {
    return redirectToggleValue
  }

  if (settingId === 'whitelist') {
    return whitelistValue
  }

  if (settingId === 'timeframe') {
    return timeframeValue
  }

  return false
}

const Settings: FC<TProps> = ({
  redirectUrl,
  claimUrl,
  campaignData,
  redirectToggleAction,
  redirectToggleValue,
  redirectSubmit,
  loading,

  whitelistSubmit,
  whitelistToggleAction,
  whitelistToggleValue,
  whitelistValue,

  timeframeSubmit,

  timeframeToggleAction,
  timeframeToggleValue,

  getDispenserWhitelist,

  currentDispenser
}) => {


  const [
    currentSetting,
    setCurrentSetting
  ] = useState<null | TSettingItem>(null)

  if (!campaignData) {
    return null
  }

  const popup = currentSetting ? definePopup(
    currentSetting,
    () => setCurrentSetting(null),
    redirectSubmit,
    timeframeSubmit,
    whitelistSubmit,
    getDispenserWhitelist,
    loading,
    redirectUrl,
    redirectToggleAction,
    redirectToggleValue,
    whitelistValue,
    whitelistToggleAction,
    whitelistToggleValue,
    timeframeToggleAction,
    timeframeToggleValue,
    campaignData.campaign_id,
    currentDispenser,
    claimUrl
  ) : null

  // if (loading) {
  //   return <WidgetLoaderStyled title='Settings'>
  //     {popup}
  //     <Loader size='large' />
  //   </WidgetLoaderStyled>
  // }

  return <>
    <WidgetStyled title='Settings'>
      {currentSetting && null}
      {popup}
      {settings.map(setting => {

        const enabled = defineEnabled(
          setting.id,
          Boolean(redirectToggleValue),
          Boolean(whitelistToggleValue),
          Boolean(timeframeToggleValue),
        )

        return renderSettingItem(
          setting,
          enabled,
          () => setCurrentSetting(setting),
          'Enabled'
        )})
      }
    </WidgetStyled>
    <NoteStyled>
      Preferred wallet and country restriction settings are available on the <TextLinkStyled to={`/campaigns/${campaignData.campaign_id}`}>Claim Links Campaign page</TextLinkStyled>
    </NoteStyled>
  </>
}

export default Settings
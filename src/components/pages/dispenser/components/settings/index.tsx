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
import AppTitle from './app-title'
import Reclaim from './reclaim'
import { useQuery } from 'hooks'

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
  }, {
    title: 'Dynamic QR App Title',
    id: 'app_title',
    subtitle: '',
    tooltip: 'Dynamic QR App Title'
  }, {
    title: 'Reclaim (ALPHA)',
    id: 'reclaim',
    subtitle: 'Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol. Learn more at https://www.reclaimprotocol.org/',
    tooltip: 'Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol.'
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

  appTitleSubmit: (value: string, onSuccess?: () => void, onError?: () => void) => void,

  reclaimSubmit: (
    reclaimAppId: any,
    reclaimAppSecret: any,
    reclaimProviderId: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void,

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
  currentDispenser?: TDispenser,
  claimUrl?: string,

  appTitle?: string,
  appTitleToggleAction?: (value: boolean) => void,
  appTitleToggleValue?: boolean,


  reclaimAppId?: string | null,
  reclaimAppSecret?: string | null,
  reclaimProviderId?: string | null,

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
    case 'reclaim':
      return <Reclaim
        {...setting}
        onClose={onClose}
        loading={loading}
        currentDispenser={currentDispenser}
        action={reclaimSubmit}

        reclaimAppId={reclaimAppId}
        reclaimAppSecret={reclaimAppSecret}
        reclaimProviderId={reclaimProviderId}
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
    case 'app_title':
      return <AppTitle
        {...setting}
        appTitle={appTitle}
        onClose={onClose}
        toggleAction={appTitleToggleAction}
        toggleValue={appTitleToggleValue}
        action={appTitleSubmit}
      />
    default: null
  }
}

const defineEnabled = (
  settingId: string,
  redirectToggleValue: boolean,
  whitelistValue: boolean,
  timeframeValue: boolean,
  appTitleValue: boolean,
  reclaim: boolean
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

  if (settingId === 'app_title') {
    return appTitleValue
  }

  if (settingId === 'reclaim') {
    return reclaim
  }

  return false
}

const Settings: FC<TProps> = ({
  redirectUrl,
  claimUrl,
  appTitle,
  campaignData,
  redirectToggleAction,
  redirectToggleValue,
  redirectSubmit,
  loading,

  appTitleSubmit,
  appTitleToggleAction,
  appTitleToggleValue,

  whitelistSubmit,
  whitelistToggleAction,
  whitelistToggleValue,
  whitelistValue,

  timeframeSubmit,

  timeframeToggleAction,
  timeframeToggleValue,
  dynamic,
  reclaim,
  getDispenserWhitelist,

  currentDispenser,


  reclaimSubmit,
  reclaimAppId,
  reclaimAppSecret,
  reclaimProviderId
}) => {

  const currentPageQuery = useQuery()
  const initialSettingFromQuery = currentPageQuery.get('settings_open')
  const initialSetting = initialSettingFromQuery ? (settings.find(setting => setting.id === initialSettingFromQuery) || null): null

  const [
    currentSetting,
    setCurrentSetting
  ] = useState<null | TSettingItem>(initialSetting)

  if (!campaignData) {
    return null
  }

  const popup = currentSetting ? definePopup(
    currentSetting,
    () => setCurrentSetting(null),
    redirectSubmit,
    timeframeSubmit,
    whitelistSubmit,
    appTitleSubmit,
    reclaimSubmit,
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
    currentDispenser,
    claimUrl,
    appTitle,
    appTitleToggleAction,
    appTitleToggleValue,
    reclaimAppId,
    reclaimAppSecret,
    reclaimProviderId
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
          Boolean(appTitleToggleValue),
          Boolean(reclaimAppId)
        )

        if (
          (!dynamic || reclaim) && setting.id === 'app_title'
          
        ) {
          return
        }
        if (!reclaim && setting.id === 'reclaim') {
          return 
        }

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

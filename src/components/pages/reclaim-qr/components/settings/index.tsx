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
} from './types'
import {
  TSettingItem
} from '../../types'
import {
  TableRow
} from 'components/pages/common'
import Icons from 'icons'
import { Tooltip } from 'components/common'

import Timeframe from './timeframe'

import Reclaim from './reclaim'

import { TDispenser } from 'types'

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


  timeframeSubmit: (value: any, onSuccess?: () => void, onError?: () => void) => void,
  
  reclaimSubmit: (
    reclaimAppId: any,
    reclaimAppSecret: any,
    reclaimProviderId: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void,

  loading: boolean,

  timeframeToggleAction?: (value: boolean) => void,
  timeframeToggleValue?: boolean,
  currentDispenser?: TDispenser,

  reclaimAppId?: string | null,
  reclaimAppSecret?: string | null,
  reclaimProviderId?: string | null,

) => {
  switch (setting.id) {
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
    default: null
  }
}

const defineEnabled = (
  settingId: string,
  timeframeValue: boolean
) => {

  if (settingId === 'timeframe') {
    return timeframeValue
  }

  if (settingId === 'reclaim') {
    return true
  }

  return false
}

const Settings: FC<TProps> = ({
  campaignData,
  loading,
  settings,
  timeframeSubmit,
  timeframeToggleAction,
  timeframeToggleValue,
  currentDispenser,
  reclaimSubmit,
  reclaimAppId,
  reclaimAppSecret,
  reclaimProviderId,
  currentSetting,
  setCurrentSetting
}) => {

  if (!campaignData) {
    return null
  }

  const popup = currentSetting ? definePopup(
    currentSetting,
    () => setCurrentSetting(null),
    timeframeSubmit,
    reclaimSubmit,
    loading,
    timeframeToggleAction,
    timeframeToggleValue,
    currentDispenser,
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
          Boolean(timeframeToggleValue)
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

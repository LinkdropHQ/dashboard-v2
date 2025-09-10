import { TCampaign, TDispenser } from "types"
import { TSettingItem } from "../../types"

type TSettings = {
  title: string
  subtitle: string
  id: string
  tooltip: string
}[]

export type TProps = {
  loading: boolean
  campaignData: TCampaign | null
  settings: TSettings
  currentDispenser?: TDispenser
  currentSetting: TSettingItem | null
  setCurrentSetting: (setting: TSettingItem | null) => void
  timeframeToggleValue?: boolean
  timeframeToggleAction?: (value: boolean) => void
  timeframeSubmit: (
    startTimeValue: any,
    finishTimeValue: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void


  reclaimSubmit: (
    reclaimAppId: any,
    reclaimAppSecret: any,
    reclaimProviderId: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void,
  reclaimAppId?: string | null,
  reclaimAppSecret?: string | null,
  reclaimProviderId?: string | null
}

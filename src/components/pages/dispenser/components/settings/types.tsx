import { TCampaign, TDispenser } from "types"

export type TProps = {
  claimUrl?: string
  appTitle?: string
  redirectUrl?: string | null
  dynamic?: boolean
  reclaim?: boolean
  loading: boolean
  campaignData: TCampaign | null
  redirectToggleAction?: (value: boolean) => void
  redirectToggleValue?: boolean
  redirectSubmit: (
    value: any,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void

  appTitleToggleAction?: (value: boolean) => void
  appTitleToggleValue?: boolean
  appTitleSubmit: (
    value: string,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void

  whitelistSubmit: (
    value: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void
  whitelistValue?: string | null
  whitelistToggleAction?: (value: boolean) => void
  whitelistToggleValue?: boolean
  currentDispenser?: TDispenser

  timeframeToggleValue?: boolean
  timeframeToggleAction?: (value: boolean) => void
  timeframeSubmit: (
    startTimeValue: any,
    finishTimeValue: any,
    onSuccess?: () => void,
    onError?: () => void
  ) => void

  getDispenserWhitelist: (dispenserId: string) => void

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

export type TSettingItem = {
  title: string
  subtitle: string
  onClose?: () => void
  id: string
  toggleAction?: () => void
  tooltip: string
}
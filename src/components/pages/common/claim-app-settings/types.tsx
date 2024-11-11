import { TCampaign, TCountry } from "types"

export type TProps = {
  loading: boolean
  campaignData: TCampaign | null

  walletsSubmit: (
    wallet: any,
    additionalWalletsOnValue: boolean,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void

  preferredWalletValue: string
  additionalWalletsOnValue: boolean

  buttonTitleValue: string
  buttonHrefValue: string
  autoRedirectValue: boolean

  finalScreenButtonSubmit: (
    buttonTitle: string,
    buttonHref: string,
    autoRedirectValue: boolean,
    successAction?: () => void,
    errorAction?: () => void
  ) => void

  finalScreenButtonToggleAction?: (value: boolean) => void
  finalScreenButtonToggleValue?: boolean

  preferredWalletToggleAction?: (value: boolean) => void
  preferredWalletToggleValue?: boolean
}

export type TSettingItem = {
  title: string
  subtitle: string
  onClose?: () => void
  id: string
  toggleAction?: () => void
  tooltip: string

}
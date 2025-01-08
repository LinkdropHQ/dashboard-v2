import { TCampaign, TCountry } from "types"

export type TProps = {
  loading: boolean
  campaignData: TCampaign | null
  
  availableCountriesSubmit: (
    value: string[],
    onSuccess?: () => void,
    onError?: () => void,
  ) => void
  availableCountriesValue: TCountry[]

  walletsSubmit: (
    wallet: any,
    additionalWalletsOnValue: boolean,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void

  preferredWalletValue: string
  additionalWalletsOnValue: boolean

  countries: TCountry[]

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

  availableCountriesToggleAction?: (value: boolean) => void
  availableCountriesToggleValue?: boolean

  preferredWalletToggleAction?: (value: boolean) => void
  preferredWalletToggleValue?: boolean


  customClaimHostOnToggleAction: (value: boolean) => void
  customClaimHostOnToggleValue: boolean

  multipleClaimsOnToggleAction: (value: boolean) => void
  multipleClaimsOnToggleValue: boolean

  customClaimHostSubmit: (
    customClaimHost: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void
  customClaimHostValue: string

}

export type TSettingItem = {
  title: string
  subtitle: string
  onClose?: () => void
  id: string
  toggleAction?: () => void
  tooltip: string

}
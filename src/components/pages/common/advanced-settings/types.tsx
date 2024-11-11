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

  countries: TCountry[]

  availableCountriesToggleAction?: (value: boolean) => void
  availableCountriesToggleValue?: boolean

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
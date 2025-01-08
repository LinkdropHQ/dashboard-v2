export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  customClaimHost: string

  action: (
    claimHost: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void


  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
}
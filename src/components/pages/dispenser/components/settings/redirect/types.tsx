export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
  redirectUrl?: string | null
  claimUrl?: string
  action: (
    value: any,
    successAction?: () => void,
    errorAction?: () => void
  ) => void
}
export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  buttonTitleValue: string
  buttonHrefValue: string

  action: (
    buttonTitleValue: string,
    buttonHrefValue: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void


  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
}
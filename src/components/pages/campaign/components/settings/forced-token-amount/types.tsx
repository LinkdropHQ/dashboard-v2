export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  forcedTokenAmount: string
  tokenDecimals: number
  tokenSymbol: string
  loading: boolean

  action: (
    amount: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void

  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
}

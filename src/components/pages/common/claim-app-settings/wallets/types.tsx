import { TTokenType } from "types"

export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  preferredWalletValue: string

  additionalWalletsOnValue: boolean

  tokenType: TTokenType

  sponsored: boolean

  chainId: number

  loading: boolean

  action: (
    walletPreferredValue: string,
    additionalWalletsOnValue: boolean,
    successAction?: () => void,
    errorAction?: () => void
  ) => void

  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
}
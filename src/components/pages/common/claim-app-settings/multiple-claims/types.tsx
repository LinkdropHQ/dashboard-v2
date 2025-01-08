import { TCountry } from "types"

export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
}
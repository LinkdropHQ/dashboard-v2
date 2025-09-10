import { TDispenser } from "types"

export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
  loading: boolean
  currentDispenser?: TDispenser
  action: (
    startTimeValue: any,
    finishTimeValue: any,
    successAction?: () => void,
    errorAction?: () => void
  ) => void
}
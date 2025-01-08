export type TProps = {
  title: string
  className?: string
  subtitle?: string
  children?: React.ReactNode
  note?: string
  onClose: () => void
  action?: () => void
  actionTitle?: string
  toggleAction?: (value: boolean) => void
  toggleState?: boolean
  actionDisabled?: boolean
}
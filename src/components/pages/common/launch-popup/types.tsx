export type TProps = {
  onClose: () => void
  children?: React.ReactNode
  title?: string
  text?: string
}

export type TLaunchStepStatus = 'current' | 'disabled' | 'done'

export type TLaunchStep = {
  status: TLaunchStepStatus,
  title: string
}
import { TDispenser } from 'types'

export type TProps = {
  title: string
  subtitle: string
  onClose: () => void
  id: string
  toggleAction?: (value: boolean) => void
  toggleValue?: boolean
  loading: boolean
  reclaimAppId?: string | null
  reclaimProviderId?: string | null
  reclaimAppSecret?: string | null
  currentDispenser?: TDispenser

  action: (
    reclaimAppIdValue: string,
    reclaimAppSecretValue: string,
    reclaimProviderIdValue: string,
    successAction?: () => void,
    errorAction?: () => void
  ) => void
}
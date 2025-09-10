export type TProps = {
  onClose: () => void
  onSubmit: () => void
  claimUrl: string
  newRedirectURL: string
  loading?: boolean
}
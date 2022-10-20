import { TLinkDecrypted } from 'types'

export type TProps = {
  onClose: () => void,
  onSubmit: (links: TLinkDecrypted[]) => void,
  quantity: number,
  loader: number,
  loading: boolean
}
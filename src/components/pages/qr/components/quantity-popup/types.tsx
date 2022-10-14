export type TProps = {
  onClose: () => void,
  onSubmit: (amount: number | string) => void,
  quantity: string | number,
  loader: number,
  loading: boolean
}
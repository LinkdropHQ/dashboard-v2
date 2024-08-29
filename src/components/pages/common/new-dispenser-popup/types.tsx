type TDispenserOption = {
  title: string
  text: string
  image: JSX.Element
  onClick: () => void
}

export type TProps ={
  onClose: () => void
  dispenserOptions: TDispenserOption[]
  title: string
  subtitle: string
}
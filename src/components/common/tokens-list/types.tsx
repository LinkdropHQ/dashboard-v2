import { TContractListItem } from "types"

export type TSelectAction = (
  contract: TContractListItem
) => void

export type TProps = {
  contracts: (TContractListItem & {
    onSelect?: TSelectAction
  })[]
  onSelect: TSelectAction
}
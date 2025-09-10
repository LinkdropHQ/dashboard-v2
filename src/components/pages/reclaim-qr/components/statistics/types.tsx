import { TDispenserStatus } from "types"

export type TProps = {
  dispenserStatus: TDispenserStatus
  linksCount: number
  linksClaimed: number
  linksAssigned: number
  downloadReport: () => void
}
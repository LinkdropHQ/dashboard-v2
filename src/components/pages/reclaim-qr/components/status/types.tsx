import { TDispenserStatus } from 'types'

export type TProps = {
  status: TDispenserStatus
  dateStart?: number | null
  dateFinish?: number | null
  timeframeOn?: boolean
}
import { FC } from 'react'
import { TDispenserStatus, TStatus } from 'types'
import { TProps } from './types'
import { StatusBarStyled } from './styled-components'
import {
  momentNoOffsetGetTime,
  formatDate,
  formatTime
} from 'helpers'

const defineStatus: (
  status: TDispenserStatus
) => TStatus = (status: TDispenserStatus) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'FINISHED':
      return 'default'
    case 'PAUSED':
      return 'info'
    case 'NOT_UPLOADED':
      return 'info'
    case 'REDIRECT':
      return 'info'
    case 'READY':
      return 'info'
    default:
      return 'info'
  }
}

const defineTitle: (status: TDispenserStatus) => string = (status: TDispenserStatus) => {
  switch (status) {
    case 'NOT_UPLOADED':
      return 'Next step'
    default:
      return 'Status'
  }
}

const defineText: (
  status: TDispenserStatus,
  timeframeOn?: boolean,
  claim_start?: Date,
  claim_start_time?: any,
  claim_finish?: Date,
  claim_finish_time?: any
) => string = (
  status,
  timeframeOn,
  claim_start,
  claim_start_time,
  claim_finish,
  claim_finish_time
  ) => {
  switch (status) {
    case 'ACTIVE': {
      if (!timeframeOn) {
        return 'Active'
      }
      if (claim_finish) {
        return `Active until ${formatDate(+claim_finish)}, ${formatTime(+claim_finish)}`
      }
      return 'Active'
    }
    case 'FINISHED':
      return 'Finished'
    case 'PAUSED':
      return 'Paused'
    case 'NOT_UPLOADED':
      return 'Upload Links'
    case 'REDIRECT':
      return 'Redirect enabled'
    case 'READY':
      if (!timeframeOn) {
        return 'Ready'
      }
      return `Starts at ${formatDate(+(claim_start as Date))}, ${formatTime(+(claim_start as Date))}`
    default:
      return ''
  }
}

const Status: FC<TProps> = ({
  status,
  dateFinish,
  dateStart,
  timeframeOn
}) => {
  const dispenserStartDate = dateStart ? new Date(dateStart) : undefined
  const dispenserFinishDate = dateFinish ? new Date(dateFinish) : undefined
  const dispenserStartTime = dateStart ? momentNoOffsetGetTime(dateStart) : undefined
  const dispenserFinishTime = dateFinish ? momentNoOffsetGetTime(dateFinish) : undefined

  const statusType = defineStatus(status)
  const title = defineTitle(status)
  const text = defineText(
    status,
    timeframeOn,
    dispenserStartDate,
    dispenserStartTime,
    dispenserFinishDate,
    dispenserFinishTime
  )

  return <StatusBarStyled
    type={statusType}
    title={title}
    text={text}
  />
}

export default Status

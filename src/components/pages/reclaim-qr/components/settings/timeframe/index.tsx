import {
  FC,
  useState,
  useRef
} from 'react'
import { TProps } from './types'
import {
  AsidePopup
} from 'components/common'
import {
  momentNoOffsetGetTime,
  createSelectOptions,
  momentNoOffsetWithTimeUpdate,
  getNextDayData
} from 'helpers'

import {
  DateTimeContainer,
  DatePickerStyled,
  SelectStyled,
  Note,
  CheckboxStyled
} from './styled-components'

const defaultValue = { label: '00', value: '0'}
const selectOptionsHours = createSelectOptions(23, defaultValue)
const selectOptionsMinutes = createSelectOptions(59, defaultValue)

const defineIfCorrect = (
  dateStartString: string,
  dateFinishString?: string | null
) => {
  if (!dateFinishString) {
    return true
  }
  return (+ new Date(dateFinishString)) > (+ new Date(dateStartString))
}

const Timeframe: FC<TProps> = ({
  title,
  subtitle,
  action,
  onClose,
  toggleAction,
  loading,
  toggleValue,
  currentDispenser
}) => {
  const dispenserStartDate = currentDispenser && currentDispenser.claim_start ? new Date(currentDispenser.claim_start) : new Date()
  const dispenserStartTime = momentNoOffsetGetTime(currentDispenser && currentDispenser.claim_start ? currentDispenser.claim_start : undefined)
  const dispenserFinishTime = momentNoOffsetGetTime(currentDispenser && currentDispenser.claim_finish ? currentDispenser.claim_finish : undefined)

  const [ dateStart, setDateStart ] = useState<Date>(dispenserStartDate)
  const [ hoursStart, setHoursStart ] = useState(dispenserStartTime.hours)
  const [ minutesStart, setMinutesStart ] = useState(dispenserStartTime.minutes)

  const dispenserFinishDate = currentDispenser && currentDispenser.claim_finish ? new Date(currentDispenser.claim_finish) : getNextDayData()
  const [ dateFinish, setDateFinish ] = useState<Date>(dispenserFinishDate)
  const [ hoursFinish, setHoursFinish ] = useState(dispenserFinishTime.hours)
  const [ minutesFinish, setMinutesFinish ] = useState(dispenserFinishTime.minutes)

  const [ dateFinishDisable, setDateFinishDisable ] = useState<boolean>(currentDispenser && currentDispenser.claim_finish === null ? true : false)
  const inputRef = useRef<HTMLInputElement>(null)

  return <AsidePopup
    title={title}
    subtitle={subtitle}
    onClose={onClose}
    toggleState={toggleValue}
    action={() => {
      const dateStartString = momentNoOffsetWithTimeUpdate(
        dateStart,
        Number(hoursStart.value),
        Number(minutesStart.value)
      )
    
      const dateFinishString = dateFinishDisable ? null : momentNoOffsetWithTimeUpdate(
        dateFinish,
        Number(hoursFinish.value),
        Number(minutesFinish.value)
      )

      const correct = defineIfCorrect(
        dateStartString,
        dateFinishString
      )

      if (!correct) {
        return alert('The end date of the QR campaign must be later than the start date')
      }

      action(
        dateStartString,
        dateFinishString,
        () => onClose()
      )
    }}
    toggleAction={toggleAction}
    
  >
    <DateTimeContainer>
      <DatePickerStyled
        title='Start date'
        disabled={loading}

        // note='Enter start date in the “dd MMM yyyy” format, e.g. “19 Apr 2022”'
        dateFormat='dd MMM yyyy'
        onChange={(value: any) => setDateStart(value)}
        value={dateStart}
        minDate={new Date(new Date().setDate(new Date().getDate() -1))}
      />

      <SelectStyled
        title='Hours'
        disabled={loading}
        value={hoursStart}
        options={selectOptionsHours}
        onChange={(option) => {
          setHoursStart(option)
          const input: HTMLInputElement | null = inputRef.current
          if (!input) { return }
          input && input.focus()
        }}
      />

      <SelectStyled
        title='Minutes'
        value={minutesStart}
        disabled={loading}
        options={selectOptionsMinutes}
        onChange={(option) => {
          setMinutesStart(option)
          const input: HTMLInputElement | null = inputRef.current
          if (!input) { return }
          input && input.focus()
        }}
      />
      <Note>UTC+0</Note>
    </DateTimeContainer>


    <DateTimeContainer>
      <DatePickerStyled
        title='Finish date'
        // note='Enter finish date in the “dd MMM yyyy” format, e.g. “19 Apr 2022”'
        dateFormat='dd MMM yyyy'
        onChange={(value: any) => setDateFinish(value)}
        value={dateFinish}
        disabled={dateFinishDisable || loading}
        minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
      />

      <SelectStyled
        title='Hours'
        value={hoursFinish}
        options={selectOptionsHours}
        disabled={dateFinishDisable || loading}
        onChange={(option) => {
          setHoursFinish(option)
          const input: HTMLInputElement | null = inputRef.current
          if (!input) { return }
          input && input.focus()
        }}
      />

      <SelectStyled
        title='Minutes'
        value={minutesFinish}
        options={selectOptionsMinutes}
        disabled={dateFinishDisable || loading}
        onChange={(option) => {
          setMinutesFinish(option)
          const input: HTMLInputElement | null = inputRef.current
          if (!input) { return }
          input && input.focus()
        }}
      />

      <Note>UTC+0</Note>
    </DateTimeContainer>
    <CheckboxStyled
        value={dateFinishDisable}
        label='No end date'
        onChange={
          (value) => {
            setDateFinishDisable(value)
          }
        }
      />
    
  </AsidePopup>
}

export default Timeframe
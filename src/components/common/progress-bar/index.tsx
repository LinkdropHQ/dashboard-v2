import { FC } from 'react'
import { ProgressBarContainer, Data, Bar } from './styled-components'

type TProps = {
  className?: string,
  current: number,
  max: number
}

const ProgressBar: FC<TProps> = ({
  className,
  current,
  max
}) => {
  if (isNaN(current)) {
    return null
  }
  const value = current / max * 100
  
  return <ProgressBarContainer className={className}>
    <Bar style={{
      width: `${value}%`
    }} />
    <Data>
      <span>{current}</span>%
    </Data>
  </ProgressBarContainer>
}

export default ProgressBar
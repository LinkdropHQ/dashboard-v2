import {
  FC,
  useState
} from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from './styled-components'
import { TProps } from './types'

const ExpandableWidget: FC<TProps> = ({
  title,
  children
}) => {
  const [
    expanded,
    setExpanded
  ] = useState<boolean>(false)

  return <WidgetStyled>
    <WidgetHeader>
      <WidgetTitleStyled>
        {title}
      </WidgetTitleStyled>

      <button onClick={() => setExpanded(!expanded)}>
        expand
      </button>
    </WidgetHeader>

    {expanded && <WidgetContent>
      {children}
    </WidgetContent>}
  </WidgetStyled> 
}

export default ExpandableWidget
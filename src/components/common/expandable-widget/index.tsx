import {
  FC,
  useState
} from 'react'
import {
  WidgetStyled,
  ButtonStyled,
  WidgetSubtitleStyled,
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from './styled-components'
import { TProps } from './types'

const ExpandableWidget: FC<TProps> = ({
  title,
  children,
  description
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

      <ButtonStyled
        onClick={() => setExpanded(!expanded)}
      >
        Edit
      </ButtonStyled>
    </WidgetHeader>
    {description}
    {expanded && <WidgetContent>
      {children}
    </WidgetContent>}
  </WidgetStyled> 
}

export default ExpandableWidget
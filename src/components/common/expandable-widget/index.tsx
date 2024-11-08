import {
  FC,
  useState
} from 'react'
import {
  WidgetStyled,
  ButtonStyled,
<<<<<<< HEAD
  WidgetSubtitleStyled,
=======
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
  WidgetHeader,
  WidgetTitleStyled,
  WidgetContent
} from './styled-components'
import { TProps } from './types'

const ExpandableWidget: FC<TProps> = ({
  title,
<<<<<<< HEAD
  children,
  description
=======
  children
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
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

<<<<<<< HEAD
      <ButtonStyled
        onClick={() => setExpanded(!expanded)}
      >
        Edit
      </ButtonStyled>
    </WidgetHeader>
    {description}
=======
      <button onClick={() => setExpanded(!expanded)}>
        expand
      </button>
    </WidgetHeader>

>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
    {expanded && <WidgetContent>
      {children}
    </WidgetContent>}
  </WidgetStyled> 
}

export default ExpandableWidget
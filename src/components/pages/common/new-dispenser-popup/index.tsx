import { FC, ReactNode } from 'react'
import {
  AsidePopupStyled,
  Option,
  OptionText,
  OptionTitle,
  OptionImage,
  OptionContent
} from './styled-components'
import { TProps } from './types'

import Icons from 'icons'

const defineDispenser = (
  title: string,
  text: string,
  image: JSX.Element,
  onClick: () => void
) => {
  return <Option onClick={onClick}>
    <OptionImage>
      {image}
    </OptionImage>
    <OptionContent>
      <OptionTitle>
        {title}
        <Icons.ArrowRightIcon />
      </OptionTitle>
      <OptionText>
        {text}
      </OptionText>
    </OptionContent>
  </Option>
}

const NewDispenserPopup: FC<TProps> = ({
  onClose,
  dispenserOptions,
  title,
  subtitle
}) => {
  return <AsidePopupStyled
    title={title}
    subtitle={subtitle}
    onClose={onClose}
  >

    {dispenserOptions.map(dispenser => {
      return defineDispenser(
        dispenser.title,
        dispenser.text,
        dispenser.image,
        dispenser.onClick
      )
    })}
  </AsidePopupStyled>
}

export default NewDispenserPopup
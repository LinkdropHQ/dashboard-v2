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

const cardTypes = [
  {
    title: 'Dynamic QR for electronic displays',
    text: 'A web page with an auto-refresh QR code that updates in real time. This ensures secure distribution, preventing a single user from claiming all tokens',
    href: '/dynamic-qrs/new',
    image: <Icons.DynamicQRPreviewIcon />
  }, {
    title: 'Printable Dispenser QR code',
    text: 'A single QR code that dispenses tokens one-by-one to users after they scan it. Ideal for controlled and sequential token distribution',
    href: '/dispensers/new',
    image: <Icons.DispenserQRPreviewIcon />
  }, {
    title: 'Printable Set of QR codes',
    text: 'A set of single-claim QR codes. Each QR code is valid for one claim only, and becomes invalid after being scanned and claimed by a user',
    href: '/qrs/new',
    image: <Icons.QRSetPreviewIcon />
  }
]


const defineDispenser = (
  title: string,
  text: string,
  image: JSX.Element,
  href: string
) => {
  return <Option to={href}>
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

const NewDispenser: FC<TProps> = ({
  onClose
}) => {
  return <AsidePopupStyled
    title='New QR campaign'
    subtitle='Start new QR campaign to distribute your tokens by choosing the method that best suits your needs:'
    onClose={onClose}
  >

    {cardTypes.map(dispenser => {
      return defineDispenser(
        dispenser.title,
        dispenser.text,
        dispenser.image,
        dispenser.href
      )
    })}


  </AsidePopupStyled>
}

export default NewDispenser
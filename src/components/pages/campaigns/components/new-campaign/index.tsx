import {
  FC
} from 'react'
import {
  AsidePopup
} from 'components/common'
import { TProps, TOption } from './types'
import {
  Option,
  OptionsList,
  OptionImage,
  OptionTitle,
  OptionText
} from './styled-components'
import OptionToken from 'images/option-nft.png'
import SBTToken from 'images/option-sbt.png'
import { useHistory } from 'react-router-dom'
import Icons from 'icons'

const options = [
  {
    title: 'Tokens and NFTs',
    subtitle: 'Choose tokens or NFTs from your wallet',
    image: OptionToken,
    href: '/campaigns/new'
  }, {
    title: 'Create Soulbound',
    subtitle: 'Mint SBTs with your own image and metadata in a few seconds',
    image: SBTToken,
    href: '/collections/new/ERC1155/initial'
  }
]

const TokenType: FC<TOption> = ({
  title,
  image,
  subtitle,
  onClick
}) => {
  return <Option onClick={onClick}>
    <OptionImage src={image} />
    <OptionTitle>
      {title}
      <Icons.ArrowRightIcon />
    </OptionTitle>
    <OptionText>
      {subtitle}
    </OptionText>
  </Option>
}

const Settings:FC<TProps> = ({
  onClose
}) => {

  const history = useHistory()

  return <AsidePopup
    onClose={onClose}
    title='Choose token'
    subtitle='What type of tokens you would like to distribute:'
  >
    <OptionsList>
      {options.map(item => {
        return <TokenType
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          onClick={() => {
            history.push(item.href)
          }}
        />
      })}
    </OptionsList>
    
  </AsidePopup>
}

export default Settings
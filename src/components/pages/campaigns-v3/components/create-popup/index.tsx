import {
  FC,
  useState
} from 'react'
import {
  TProps
} from './types'
import { InputStyled } from './styled-components'
import {
  AsidePopup
} from 'components/common'

const CreatePopup: FC<TProps> = ({
  onClose,
  onSubmit
}) => {
  const [
    title,
    setTitle
  ] = useState<string>('')

  return <AsidePopup
    title='New campaign'
    subtitle='Enter the name for your drop. This name will be visible only for you.'
    onClose={onClose}
    action={() => onSubmit(title)}
  >

    <InputStyled
      placeholder='My Campaign 01'
      value={title}
      onChange={(value) => {
        setTitle(value)
        return value
      }}
    />

  </AsidePopup>
}

export default CreatePopup
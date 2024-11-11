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
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IAppDispatch } from 'data/store'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    createCampaign: (
      title: string,
      callback: (campaignId: string) => void 
    ) => {
      
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> & TProps

const CreateCampaign: FC<ReduxType> = ({
  onClose,
  createCampaign
}) => {
  const [
    title,
    setTitle
  ] = useState<string>('')

  return <AsidePopup
    title='New campaign'
    subtitle='Enter the name for your drop. This name will be visible only for you.'
    onClose={onClose}
    action={() => createCampaign(
      title,
      // @ts-ignore
      () => onClose()
    )}
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

// @ts-ignore
export default connect(null, mapDispatcherToProps)(CreateCampaign)
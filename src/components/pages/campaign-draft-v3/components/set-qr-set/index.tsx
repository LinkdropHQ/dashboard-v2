import {
  FC,
  useState,
  useEffect
} from 'react'
import {
  TProps
} from './types'
import {
  InputStyled
} from './styled-components'
import {
  AsidePopup
} from 'components/common'
import {
  useParams
} from 'react-router-dom'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import {
  TRouterURLParams
} from 'types'

import { connect } from 'react-redux'
import { RootState, IAppDispatch } from 'data/store'

const mapStateToProps = ({
  campaign: {
    tokenStandard,
    loading,
    decimals
  }
}: RootState) => ({
  tokenStandard,
  loading,
  decimals
})

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    // @ts-ignore
    addQRSetData: (
      campaignId: string,
      quantity: string,
      callback?: () => void
    ) => {
      dispatch(
        campaignAsyncActions.addQRSetData({
          campaignId,
          quantity: Number(quantity),
          successCallback: callback
      }))
    },
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> &
                 ReturnType<typeof mapStateToProps> &
                 TProps

const SetQRSet: FC<ReduxType> = ({
  addQRSetData,
  setCurrentStep,
  loading
}) => {

  const { type, id } = useParams<TRouterURLParams>()

  const [
    quantity,
    setQuantity
  ] = useState<string>('')

  return <AsidePopup
    title='Quantity'
    subtitle='Choose how many QR codes you need for this drop.'
    onClose={() => {
      // @ts-ignore
      setCurrentStep(null)
    }}
    action={() => {
      addQRSetData(
        id,
        quantity,
        () => setCurrentStep(null)
      )
    }}
  >

    <InputStyled
      title='Quantity'
      placeholder='Amount'
      value={quantity}
      disabled={loading}
      note='Maximum quantity in a batch is limited by 100000'
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setQuantity(value)
        }
        return value
      }}
    />

  </AsidePopup>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(SetQRSet)
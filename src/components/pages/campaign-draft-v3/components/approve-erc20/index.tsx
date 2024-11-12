import {
  FC,
  useState,
  useEffect
} from 'react'
import {
  TProps
} from './types'
import { InputStyled } from './styled-components'
import {
  AsidePopup
} from 'components/common'
import * as userAsyncActions from 'data/store/reducers/user/async-actions/index'
import { RootState, IAppDispatch } from 'data/store'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import {
  TAssetsData,
  TLinkContent,
  TTotalAmount
} from 'types'
import {
  convertLinksContentERC20V3
} from 'helpers'
import { connect } from 'react-redux'

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
    approveERC20: (
      assets: TAssetsData,
      totalAmount: TTotalAmount,
      callback: () => void
    ) => {
      dispatch(
        userAsyncActions.approveERC20V3(
          assets,
          totalAmount,
          callback
        )
      )
    },
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> &
                 ReturnType<typeof mapStateToProps> &
                 TProps

const ApproveERC20: FC<ReduxType> = ({
  onClose,
  approveERC20,
  decimals
}) => {

  const [
    amountPerClaim,
    setAmountPerClaim
  ] = useState<string>('')

  const [
    claimsAmount,
    setClaimsAmount
  ] = useState<string>('')

  const [
    assetsParsed,
    setAssetsParsedValue
  ] = useState<TAssetsData>([])

  useEffect(() => {
    if (
      !amountPerClaim ||
      !claimsAmount
    ) {
      return setAssetsParsedValue([])
    }
    let assets = convertLinksContentERC20V3(
      amountPerClaim,
      claimsAmount,

      // @ts-ignore
      decimals as number
    )
    if (!assets) { return setAssetsParsedValue([]) }
    setAssetsParsedValue(assets)
  }, [
    amountPerClaim,
    claimsAmount
  ])

  return <AsidePopup
    title='Set distribution details'
    subtitle='Set up the quantity of links and amount per link, and the way users should pay or not for gas.'
    onClose={onClose}
    action={() => {}}
  >

    <InputStyled
      placeholder='Amount per claim'
      title='Amount'
      value={amountPerClaim}
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setAmountPerClaim(value)
        }
        return value
      }}
    />

    <InputStyled
      placeholder='Claims'
      title='Number'
      value={claimsAmount}
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setClaimsAmount(value)
        }
        return value
      }}
    />

  </AsidePopup>
}

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(ApproveERC20)
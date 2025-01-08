import {
  FC,
  useState,
  useEffect
} from 'react'
import {
  TProps
} from './types'
import {
  InputStyled,
  ToggleStyled
} from './styled-components'
import {
  AsidePopup
} from 'components/common'
import {
  useParams
} from 'react-router-dom'
import * as userAsyncActions from 'data/store/reducers/user/async-actions/index'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'

import { RootState, IAppDispatch } from 'data/store'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import {
  TAssetsData,
  TLinkContent,
  TTotalAmount,
  TRouterURLParams
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
    addERC20Links: (
      campaignId: string,
      amountPerLink: string,
      linksAmount: string,
      weiAmount: string,
      callback: () => void
    ) => {
      dispatch(
        campaignAsyncActions.addERC20Links(
          campaignId,
          amountPerLink,
          linksAmount,
          weiAmount,
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
  addERC20Links,
  decimals,
  setCurrentStep,
  loading
}) => {

  const { type, id } = useParams<TRouterURLParams>()

  const [
    amountPerClaim,
    setAmountPerClaim
  ] = useState<string>('')

  const [
    claimsAmount,
    setClaimsAmount
  ] = useState<string>('')

  const [
    weiEnabled,
    setWeiEnabled
  ] = useState<boolean>(false)

  const [
    weiAmount,
    setWeiAmount
  ] = useState<string>('')

  return <AsidePopup
    title='Set distribution details'
    subtitle='Set up the quantity of links and amount per link, and the way users should pay or not for gas.'
    onClose={() => {
      // @ts-ignore
      setCurrentStep(null)
    }}
    action={() => {
      addERC20Links(
        id,
        amountPerClaim,
        claimsAmount,
        weiAmount,
        () => {
          setCurrentStep(null)
        }
      )
    }}
  >

    <InputStyled
      title='Amount per claim'
      placeholder='Amount'
      value={amountPerClaim}
      disabled={loading}
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setAmountPerClaim(value)
        }
        return value
      }}
    />

    <InputStyled
      placeholder='Number'
      title='Claims'
      value={claimsAmount}
      disabled={loading}
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setClaimsAmount(value)
        }
        return value
      }}
    />

    <ToggleStyled
      value={weiEnabled}
      label={`Include extra ETH`}
      disabled={loading}
      onChange={((value) => {
        setWeiEnabled(value)
      })}
    />

    {weiEnabled && <InputStyled
      placeholder='Number'
      value={weiAmount}
      disabled={loading}
      onChange={(value) => {
        if (/^[0-9]+$/.test(value) || value === '') {
          setWeiAmount(value)
        }
        return value
      }}
    />}

  </AsidePopup>
}

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(ApproveERC20)
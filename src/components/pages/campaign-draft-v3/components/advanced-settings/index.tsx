import {
  FC,
  useState
} from 'react'
import {
  TProps
} from './types'
import {
  TCountry
} from 'types'
import * as CommonComponents from 'components/pages/common'
import {
  updateSettings
} from 'data/store/reducers/campaign/async-actions'
import {
  ExpandableWidget
} from 'components/common'
import { connect } from 'react-redux'
import { RootState, IAppDispatch } from 'data/store'
import {
  ButtonsContainer,
  ButtonStyled
} from '../../styled-components'

const mapStateToProps = ({
  campaigns: {
    campaigns,
    loading
  },
  user: {
    address,
    dashboardKey,
    signer,
    jsonRPCProvider,
    chainId,
    countries
  },
  campaign: {
    decimals,
    loading: campaignLoading
  },
}: RootState) => ({
  campaigns,
  address,
  countries,
  decimals,
  campaignLoading,
  loading,
  dashboardKey,
  signer,
  provider: jsonRPCProvider,
  chainId
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps> & TProps

const AdvancedSettings: FC<ReduxType> = ({

}) => {
  

  return <ExpandableWidget
    title='Advanced settings'
    description={
      <span></span>
    }
  >
  
    <ButtonsContainer>
      <ButtonStyled
        appearance='action'
        onClick={() => {
          
        }}
      >
        Apply
      </ButtonStyled>
      <ButtonStyled
        onClick={() => {
          
        }}
      >
        Cancel
      </ButtonStyled>
    </ButtonsContainer>
  </ExpandableWidget>
}

// @ts-ignore
export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(AdvancedSettings)
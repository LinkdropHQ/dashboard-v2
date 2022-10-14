import { FC } from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import ProtectedRoute from './protected-route'
import { IAppDispatch } from 'data/store'
import {
  NotFound,
  Page,
  Campaigns,
  CampaignsDetails,
  Main,
  CampaignsCreateInitial,
  CampaignsCreateApprove,
  CampaignsCreateSecure,
  CampaignsCreateGenerate,
  QRs,
  QR,
  QRDownload
} from 'components/pages'

import * as userAsyncActions from 'data/store/reducers/user/async-actions'
import { connect } from 'react-redux';
import { RootState } from 'data/store';

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    connectWallet: () => userAsyncActions.connectWallet(dispatch),
  }
}

const mapStateToProps = ({ user: { address } }: RootState) => ({ address })
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const AppRouter: FC<ReduxType> = ({ address }) => {
  return <HashRouter>
    <Page>
      <Switch>
        <ProtectedRoute
          path='/campaigns/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsDetails}
        />
        <ProtectedRoute
          path='/campaigns'
          exact={true}
          loggedIn={Boolean(address)}
          component={Campaigns}
        />

        <ProtectedRoute
          path='/campaigns/new/:type/initial'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateInitial}
        />

        <ProtectedRoute
          path='/campaigns/edit/:type/:id/initial'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateInitial}
        />
        

        <ProtectedRoute
          path='/campaigns/new/:type/approve'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateApprove}
        />

        <ProtectedRoute
          path='/campaigns/edit/:type/:id/approve'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateApprove}
        />

        <ProtectedRoute
          path='/campaigns/new/:type/secure'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateSecure}
        />

        <ProtectedRoute
          path='/campaigns/edit/:type/:id/secure'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateSecure}
        />  

        <ProtectedRoute
          path='/campaigns/new/:type/generate'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateGenerate}
        />

        <ProtectedRoute
          path='/campaigns/edit/:type/:id/generate'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateGenerate}
        />

        <ProtectedRoute
          path='/qrs'
          exact={true}
          loggedIn={Boolean(address)}
          component={QRs}
        />

        <ProtectedRoute
          path='/qrs/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={QR}
        />
        <ProtectedRoute
          path='/qrs/:id/download'
          exact={true}
          loggedIn={Boolean(address)}
          component={QRDownload}
        />  

        <Route path='/' exact={true} render={props => <Main {...props} />} />
        <Route path='*' render={props => <NotFound
          {...props}
        />} />
      </Switch>
    </Page>
  </HashRouter>
}

export default connect(mapStateToProps, mapDispatcherToProps)(AppRouter)

// /

// /campaings/
// /campaigns/new/:type/initial
// /campaigns/new/:type/approve (only erc20/erc721/erc1155)
// /campaigns/new/:type/secure

// /campaigns/:id
// /campaigns/:id/edit/initial
// /campaigns/:id/edit/approve
// /campaigns/:id/edit/secure

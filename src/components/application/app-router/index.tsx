import { FC } from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import ProtectedRoute from './protected-route'

import {
  NotFound,
  Page,
  Campaigns,
  Campaign,
  CampaignsCreateInitial,
  CampaignsCreateApprove,
  CampaignsCreateSecure,
  CampaignsCreateGenerate,
  QR,
  Main,
  CampaignsCreateNew,
  QRDownload,
  QRCreate,
  QRManager,
  DispenserCreate,
  Dispenser,
  DynamicQRCreate,
  Collections,
  CollectionAddToken,
  CollectionsCreateInitial,
  Collection,
  CampaignDispenserGenerate,
  CampaignQRsGenerate,
  ReclaimQR,
  ReclaimQRCreate,
  Reclaims
} from 'components/pages'
import { connect } from 'react-redux'
import { RootState } from 'data/store'

const mapStateToProps = ({ user: { provider, address } }: RootState) => ({ provider, address })
type ReduxType = ReturnType<typeof mapStateToProps>

const AppRouter: FC<ReduxType> = ({ address }) => {
  return <HashRouter>
    <Page>
      <Switch>
        <ProtectedRoute
          path='/campaigns/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateNew}
        />

        <ProtectedRoute
          path='/qr-manager'
          exact={true}
          loggedIn={Boolean(address)}
          component={QRManager}
        />

        <ProtectedRoute
          path='/campaigns/edit/:type/:id/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignsCreateNew}
        />

        <ProtectedRoute
          path='/campaigns/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={Campaign}
        />

        <ProtectedRoute
          path='/campaigns/:id/dispenser/generate'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignDispenserGenerate}
        />

        <ProtectedRoute
          path='/campaigns/:id/qrs/generate'
          exact={true}
          loggedIn={Boolean(address)}
          component={CampaignQRsGenerate}
        />

        <ProtectedRoute
          path='/campaigns'
          exact={true}
          loggedIn={Boolean(address)}
          component={Campaigns}
        />

        <ProtectedRoute
          path='/collections'
          exact={true}
          loggedIn={Boolean(address)}
          component={Collections}
        />

        <ProtectedRoute
          path='/collections/new/:type/initial'
          exact={true}
          loggedIn={Boolean(address)}
          component={CollectionsCreateInitial}
        />

        <ProtectedRoute
          path='/collections/:collection_id'
          exact={true}
          loggedIn={Boolean(address)}
          component={Collection}
        />

        <ProtectedRoute
          path='/collections/:collection_id/token/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={CollectionAddToken}
        />

        <ProtectedRoute
          path='/dispensers/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={DispenserCreate}
        />

        <ProtectedRoute
          path='/dispensers/edit/:dispenserId'
          exact={true}
          loggedIn={Boolean(address)}
          component={DispenserCreate}
        />

        <ProtectedRoute
          path='/dispensers/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={Dispenser}
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
          path='/dynamic-qrs/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={DynamicQRCreate}
        />

        <ProtectedRoute
          path='/dynamic-qrs/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={Dispenser}
        />
{/* 
        <ProtectedRoute
          path='/reclaims/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={ReclaimQRCreate}
        />

        <ProtectedRoute
          path='/reclaims/:id'
          exact={true}
          loggedIn={Boolean(address)}
          component={ReclaimQR}
        />

        <ProtectedRoute
          path='/reclaims'
          exact={true}
          loggedIn={Boolean(address)}
          component={Reclaims}
        /> */}

        

        <ProtectedRoute
          path='/qrs/new'
          exact={true}
          loggedIn={Boolean(address)}
          component={QRCreate}
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

        <Route path='/' exact={true}>
          <Main />
        </Route>

        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </Page>
  </HashRouter>
}

export default connect(mapStateToProps)(AppRouter)

// /

// /campaings/
// /campaigns/new/:type/initial
// /campaigns/new/:type/approve (only erc20/erc721/erc1155)
// /campaigns/new/:type/secure

// /campaigns/:id
// /campaigns/:id/edit/initial
// /campaigns/:id/edit/approve
// /campaigns/:id/edit/secure

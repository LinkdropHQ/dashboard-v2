import { FC, useState } from 'react'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  CreatePopup
} from './components'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import { useHistory } from 'react-router-dom'

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    createCampaign: (
      title: string,
      callback: (campaignId: string) => void 
    ) => {
      dispatch(campaignAsyncActions.create(
        title,
        callback
      ))
    }
  }
}

const mapStateToProps = ({
  campaigns: {
    campaigns,
    drafts,
    loading
  },
  user: {
    address,
    chainId,
    loading: userLoading
  },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  loading,
  drafts,
  userLoading
})

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const CampaignsPage: FC<ReduxType> = ({
  campaigns,
  createCampaign
}) => {
  const history = useHistory()
  const [
    showPopup,
    setShowPopup
  ] = useState<boolean>(false)
  return <>
    <button
      onClick={() => {
        setShowPopup(true)
      }}
    >
      create campaign
    </button>
    {showPopup && <CreatePopup
      onSubmit={(title) => {
        createCampaign(
          title,
          campaignId => history.push(`/campaigns/${campaignId}/draft`)
        )
      }}
      onClose={() => setShowPopup(true)}
    />}
  </>
  
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsPage)

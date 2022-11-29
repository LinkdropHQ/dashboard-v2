import { Dispatch } from 'redux'
import * as userActions from 'data/store/reducers/user/actions'

import {
  UserActions,
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { authorizationApi } from 'data/api'

const logout = () => {
  return async (dispatch: Dispatch<UserActions>  & Dispatch<CampaignActions>) => {   
    dispatch(userActions.setLoading(true))
    try {
      const logout = await authorizationApi.logout()
      if (logout.statusText === 'OK') {
        window.location.reload()
      }
      
    } catch (err) {
      console.error({ err })
      dispatch(userActions.setLoading(false))
    }
  }
}

export default logout


// get
// 4223502431
// 799be89db4a45876862dadb04f7b6afe546fc5d61b651208007eb906def5b045
// encrypted ip6cv+Mdmr94FHNHbtYwsCeQjUYkju6HY26+CgMwvrVtDaMAxAI7Ug0vWqneK+f+7YOE29pnZ6+3NL2kyik3/nGb+bYWRs8sBPbYQwewsDIsFTOh0uirsFnT9WM=
// 
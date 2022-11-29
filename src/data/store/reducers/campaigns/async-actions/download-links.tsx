import { Dispatch } from 'redux'
import * as actionsCampaign from '../../campaign/actions'
import { CampaignActions } from '../../campaign/types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { CampaignsActions } from '../types'
import { campaignsApi } from 'data/api'
import * as actionsCampaigns from '../actions'
import {
  downloadLinksAsCSV,
  decryptLinks
} from 'helpers'


const downloadLinks = (
  batchId: string | number,
  campaignId: string | number,
  title: string
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {

    const { user: { dashboardKey} } = getState() 
    
    if (!dashboardKey) { return alert ('dashboardKey is not provided') }
    try {
      dispatch(actionsCampaigns.setLoading(true))
      
      const result = await campaignsApi.getBatch(campaignId, batchId)

      if (result.data.success) {
        const { claim_links, batch } = result.data
        const decryptedLinks = decryptLinks(claim_links, dashboardKey)
        downloadLinksAsCSV(
          decryptedLinks,
          title,
          batch.created_at || ''
        )
      }

      dispatch(actionsCampaigns.setLoading(false))
    } catch (err) {
      alert('Error occured! Check console for more info')
      console.error('Some error occured', err)
    }
  }
}

export default downloadLinks
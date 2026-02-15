import { Dispatch } from 'redux'
import { CampaignActions } from '../../campaign/types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { CampaignsActions } from '../types'
import { campaignsApi } from 'data/api'
import * as actionsCampaigns from '../actions'
import * as actionsUser from '../../user/actions'
import * as actionsAsyncUser from '../../user/async-actions'
import {
  downloadLinksAsCSV,
  alertError,
  defineNetworkName
} from 'helpers'
import { plausibleApi } from 'data/api'
import { decrypt } from 'lib/crypto'

const downloadReport = (
  campaignId: string,
  encryptionKey?: string
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {
    const { user: { chainId } } = getState()
    if (!campaignId) { return alertError ('campaignId is not provided') }

    const callback = async (key: string) => {
      dispatch(actionsCampaigns.setLoading(true))

      try {
        const { data: { links_data } } = await campaignsApi.getReport(campaignId)
        if (links_data.length === 0) {
          alertError('No data for report. At least one claimed link is needed for report')
          return dispatch(actionsCampaigns.setLoading(false))
        }

        const decryptedLinksData = links_data.map((link: any) => {
          const { encrypted_claim_code, encrypted_claim_link, link_id, ...rest } = link
          let claim_code: string | null = null
          if (encrypted_claim_code) {
            try {
              claim_code = decrypt(encrypted_claim_code, encryptionKey || key)
            } catch (err) {
              console.error('Failed to decrypt claim code for link', err)
            }
          }
          return { link_id, claim_code, ...rest }
        })

        downloadLinksAsCSV(decryptedLinksData, `REPORT-${campaignId}`)
        plausibleApi.invokeEvent({
          eventName: 'download_report',
          data: {
            network: defineNetworkName(chainId),
            type: 'campaign',
            campaignId
          }
        })
      } catch (err) {
        alertError('Check console for more info')
        console.error('Some error occured', err)
      }
      dispatch(actionsCampaigns.setLoading(false))
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      if (!encryptionKey) {
        dispatch(actionsCampaigns.setLoading(false))
        dispatch(actionsUser.setDashboardKeyPopup(true))
        dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
        return
      } else {
        dashboardKey = encryptionKey
      }
    }

    callback(dashboardKey)
  }
}

export default downloadReport
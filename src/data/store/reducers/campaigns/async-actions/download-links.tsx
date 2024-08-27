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
  decryptLinks,
  alertError
} from 'helpers'
import { TClaimPattern, TTokenType } from 'types'
import { plausibleApi } from 'data/api'
import { defineNetworkName } from 'helpers'


const downloadLinks = (
  batchId: string | number,
  campaignId: string,
  title: string,
  tokenAddress: string | null,
  chainId: number,
  tokenType: TTokenType,
  sdk: boolean,
  sponsored: boolean,
  claimPattern: TClaimPattern,
  wallet: string,
  encryptionKey?: string,
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {

    let {
      user: {
        address
      },
    } = getState()

    if (!tokenAddress) { return alertError ('tokenAddress is not provided') }

    dispatch(actionsCampaigns.setLoading(true))

    const callback = async (
      dashboardKey: string
    ) => {
      dispatch(actionsCampaigns.setLoading(true))

      try {
        
        const result = await campaignsApi.getBatch(campaignId, batchId)
  
        if (result.data.success) {
          const { claim_links, batch } = result.data
          const decryptedLinks = decryptLinks({
            links: claim_links,
            dashboardKey: String(dashboardKey),
            tokenAddress,
            userAddress: address,
            chainId,
            wallet
          })
  
          downloadLinksAsCSV(
            decryptedLinks,
            title,
            batch.created_at || ''
          )
          plausibleApi.invokeEvent({
            eventName: 'download_links',
            data: {
              network: defineNetworkName(chainId),
              token_type: tokenType as string,
              claim_pattern: claimPattern,
              distribution: sdk ? 'sdk' : 'manual',
              sponsorship: sponsored ? 'sponsored' : 'non sponsored',
              preferred_wallet: wallet
            }
          })
        }
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
    dispatch(actionsCampaigns.setLoading(false))
  }
}

export default downloadLinks
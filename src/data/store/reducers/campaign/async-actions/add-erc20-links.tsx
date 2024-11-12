import { campaignsApi } from "data/api"
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsUser from '../../user/actions'

import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import {
  alertError,
  createProxy
} from 'helpers'
import { ethers } from 'ethers'
import * as actionsAsyncUser from '../../user/async-actions'
import { encrypt } from 'lib/crypto'

const addERC20Links = (
  campaignId: string,
  amountPerLink: string,
  linksAmount: string,
  weiAmount: string
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {
    const {
      user: {
        sdk,
        address,
        chainId
      },
      campaign: {
        tokenAddress
      }
    } = getState()

    const callback = async (
      dashboardKey: string
    ) => {
      try {

        const linkData = {
          token_amount: amountPerLink,
          expiration_time: String(expirationDate),
          wei_amount: weiAmount
        }

        // const linkData = {
        //   token_id: String(assets[i].id || '0'),
        //   token_amount: assets[i].amount || '0',
        //   expiration_time: String(expirationDate),
        //   wei_amount: String(nativeTokensPerLink)
        // }

        // const linkData = {
        //   token_id: String(assets[i].id || '0'),
        //   token_amount: assets[i].amount || '0',
        //   expiration_time: String(expirationDate),
        //   wei_amount: String(nativeTokensPerLink)
        // }
        
        // if (data.success) {
        //   if (callback) {
        //     callback(data.campaign.campaign_id)
        //   }
        // }
        
      } catch (err) {
        alertError('Some error occured. Please check console for more info')
      }
    }

    let dashboardKey = actionsAsyncUser.useDashboardKey(getState)

    if (!dashboardKey) {
      dispatch(actionsCampaign.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      return 
    }
    
    await callback(dashboardKey)
    dispatch(actionsCampaign.setLoading(false))

  }
}

export default addERC20Links
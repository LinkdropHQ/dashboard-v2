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

const createCampaign = (
  title: string,
  callback?: (
    campaignId: string
  ) => void
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
      }
    } = getState()

    const callback = async (
      dashboardKey: string
    ) => {
      try {
        const campaignId = String(+(new Date()))
        const proxyContractAddress = await createProxy(
          chainId as number,
          address as string,
          campaignId,
          sdk
        )
    
        if (!proxyContractAddress) {
          throw new Error('proxyContractAddress is not defined')
        }
  
        const newWallet = ethers.Wallet.createRandom()
        const { address: wallet, privateKey } = newWallet
  
        dispatch(actionsCampaign.setSignerKey(privateKey))
        dispatch(actionsCampaign.setSignerAddress(wallet))
    
        const { data } = await campaignsApi.createV3({
          title,
          chain_id: String(chainId),
          campaign_number: campaignId,
          proxy_contract_address: proxyContractAddress,
          creator_address: address,
          encrypted_signer_key: encrypt(privateKey, dashboardKey),
          signer_address: wallet,
          proxy_contract_version: ''
        })
  
        if (data.success) {
          if (callback) {
            callback(data.campaign.campaign_id)
          }
        }
        
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

export default createCampaign
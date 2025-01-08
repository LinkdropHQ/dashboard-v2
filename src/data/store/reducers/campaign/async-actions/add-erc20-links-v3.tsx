import { campaignsApi } from "data/api"
import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsUser from '../../user/actions'
import * as actionsCampaigns from '../../campaigns/actions'

import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { CampaignsActions } from '../../campaigns/types'

import { RootState } from 'data/store'
import {
  alertError,
  createProxy
} from 'helpers'
import { ethers, utils } from 'ethers'
import * as actionsAsyncUser from '../../user/async-actions'
import { TLink, TTokenType } from 'types'

const addERC20Links = (
  campaignId: string,
  amountPerLink: string,
  linksAmount: string,
  weiAmount: string,
  actionCallback: () => void
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsCampaign.setLoading(true))

    const {
      campaign: {
        expirationDate,
        decimals,
        tokenAddress,
        tokenStandard
      },
      campaigns: {
        campaigns
      }
    } = getState()

    try {
      const links: TLink[] = []
      const amountOfLinks = Number(linksAmount)
      for (let i = 0; i < amountOfLinks; i++) {
        links.push({
          token_amount: String(
            utils.parseUnits(amountPerLink, decimals as number)
          ),
          expiration_time: String(expirationDate),
          wei_amount: weiAmount ? utils.parseUnits(weiAmount, decimals as number).toString() : '0'
        })
      }

      const result = await campaignsApi.saveBatchV3({
        campaign_id: campaignId,
        claim_links: links,
        token_address: tokenAddress as string,
        token_standard: tokenStandard as TTokenType
      })

      if (result.data.success) {
        dispatch(actionsCampaign.setLinks(links))

        const campaignsUpdated = campaigns.map(campaign => {
          if (campaign.campaign_id === campaignId) {
            return {
              ...campaign,
              token_address: tokenAddress as string,
              token_standard: tokenStandard as TTokenType
            }
          }

          return campaign
        })

        dispatch(
          actionsCampaigns.updateCampaigns(campaignsUpdated)
        )

        if (actionCallback) {
          actionCallback()
        }
      }
    } catch (err) {
      dispatch(actionsCampaign.setLoading(false))
      alertError('Some error occured. Please check console for more info')
      console.error(err)
    }

    dispatch(actionsCampaign.setLoading(false))

  }
}

export default addERC20Links
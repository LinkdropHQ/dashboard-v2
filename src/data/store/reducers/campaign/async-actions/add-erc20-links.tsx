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
import { ethers, utils } from 'ethers'
import * as actionsAsyncUser from '../../user/async-actions'
import { TLink } from 'types'

const addERC20Links = (
  campaignId: string,
  amountPerLink: string,
  linksAmount: string,
  weiAmount: string,
  actionCallback: () => void
) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions>,
    getState: () => RootState
  ) => {
    dispatch(actionsCampaign.setLoading(true))

    const {
      user: {
        sdk,
        address,
        chainId
      },
      campaign: {
        tokenAddress,
        expirationDate,
        decimals
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
        claim_links: links
      })

      if (result.data.success) {
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
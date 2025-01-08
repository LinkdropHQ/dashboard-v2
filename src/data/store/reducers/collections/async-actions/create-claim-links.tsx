
import { Dispatch } from 'redux';
import * as actionsCollections from '../actions'
import { CollectionsActions } from '../types'
import { UserActions } from '../../user/types'
import { IAppDispatch } from 'data/store'
import {  alertError } from 'helpers'
import { RootState } from 'data/store'
import { TTokenType } from 'types'
import * as actionsCampaign from '../../campaign/actions'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'
import createProxyAddress from '../../campaign/async-actions/create-proxy-address'
import getCollectionData from './get-collection-data'

function createClaimLinks (
  collectionId: string,
  tokenId: string,
  linksAmount: string,
  tokenType: TTokenType,
  campaignId: string | null,
  callback?: (location: string) => void
) {
  // @ts-ignore
  return async (
    dispatch: Dispatch<CollectionsActions> & Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    dispatch(actionsCollections.setLoading(true))
    const {
      user: {
        chainId,
        sdk,
        address
      },
      collections: {
        collections
      },
      campaigns: {
        campaigns
      }
      // @ts-ignore
    } = getState()
    try {
      const collection = collections.find(collection => collection.collection_id === collectionId)
      if (!collection) {
        dispatch(actionsCollections.setLoading(false))
        return alert('Collection not found')
      }
      const collectionTokens = collection.tokens

      if (!collectionTokens || collectionTokens.length === 0) {
        await dispatch(getCollectionData(
          collectionId
        ))
      }
      if (!chainId) {
        dispatch(actionsCollections.setLoading(false))
        return alert('chainId not provided')
      }
      dispatch(actionsCampaign.setTokenAddress(collection.token_address as string))
      dispatch(actionsCampaign.setCollectionId(collectionId))
      dispatch(actionsCampaign.setCollectionTokenId(tokenId))

      dispatch(actionsCampaign.setDecimals(0))
      dispatch(actionsCampaign.setSymbol(collection.symbol))
      dispatch(actionsCampaign.setTokenStandard(tokenType))
      dispatch(actionsCampaign.setTitle(`Links for "${collection.title}"`))
      dispatch(actionsCampaign.setClaimPattern('mint'))
      if (!campaignId) {
        await createProxyAddress(
          dispatch,
          chainId,
          sdk,
          address
        )

        if (callback) {
          callback(`/campaigns/new/${tokenType}/approve?token_id=${tokenId}&links_amount=${linksAmount}&collection_id=${collectionId}`)
        }
      } else {
        const campaign = campaigns.find(campaign => campaign.campaign_id === campaignId)
        if (campaign) {
          const { proxy_contract_address } = campaign
          dispatch(actionsCampaign.setProxyContractAddress(proxy_contract_address))
          dispatch(actionsCampaign.setId(campaign.campaign_number))
        }
        if (callback) {
          callback(`/campaigns/edit/${tokenType}/${campaignId}/approve?token_id=${tokenId}&links_amount=${linksAmount}&collection_id=${collectionId}`)
        }
      }


    } catch (err) {
      console.error({
        err
      })
      alertError('Some error occured. Please check console for more info')
    }
    dispatch(actionsCollections.setLoading(false))
  }
}

export default createClaimLinks

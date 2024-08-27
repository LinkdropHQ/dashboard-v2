import { Dispatch } from 'redux'
import * as userActions from '../actions'
import { TQRSet, TCampaign, TDispenser, TCollection } from 'types'
import * as qrsActions from '../../qrs/actions'
import * as qrManagerActions from '../../qr-manager/actions'
import * as campaignsActions from '../../campaigns/actions'
import * as dispensersActions from '../../dispensers/actions'
import * as colllectionsActions from '../../collections/actions'
import { UserActions } from '../types'
import { QRsActions } from '../../qrs/types'
import { CampaignsActions } from '../../campaigns/types'
import { DispensersActions } from '../../dispensers/types'
import { CollectionsActions } from '../../collections/types'
import { QRManagerActions } from '../../qr-manager/types'

import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import { RootState } from 'data/store'
import {
  campaignsApi,
  qrsApi,
  dispensersApi,
  collectionsApi,
  countriesApi,
  qrManagerApi
} from 'data/api'
import { alertError, defineClaimAppURL } from 'helpers'

const {
  REACT_APP_INFURA_ID,
  REACT_APP_SERVER_URL,
  REACT_APP_ZUPLO_API_KEY
} = process.env

const initialization = () => {
  return async (
    dispatch: Dispatch<UserActions> &
              Dispatch<QRsActions> &
              Dispatch<CampaignsActions> &
              Dispatch<DispensersActions> &
              Dispatch<CollectionsActions> &
              Dispatch<CollectionsActions> &
              Dispatch<QRManagerActions>,
    getState: () => RootState
  ) => {
    const { user: { address, chainId, provider }} = getState()
    const claimAppURL = defineClaimAppURL(address)

    if (!REACT_APP_SERVER_URL) {
      return alertError('REACT_APP_SERVER_URL is not provided in .env file')
    }
    if (!chainId) {
      return alertError('Chain id is not provided')
    }
    if (!REACT_APP_INFURA_ID) {
      return alertError('REACT_APP_INFURA_ID is not provided in .env file')
    }
    try {
      dispatch(campaignsActions.setLoading(true))
      dispatch(qrsActions.setLoading(true))
      dispatch(dispensersActions.setLoading(true))
      dispatch(colllectionsActions.setLoading(true))
      dispatch(qrManagerActions.setLoading(true))

      const countries = await countriesApi.get()
      if (countries) {
        dispatch(userActions.setCountries(countries.data))
      }

      await Promise.all([
        campaignsApi.get(chainId),
        dispensersApi.get(),
        qrsApi.get(),
        qrManagerApi.get(),
        collectionsApi.get()
      ]).then(([
        campaignsData,
        dispensersData,
        qrsData,
        qrManagerData,
        collectionsData
      ]) => {
        const campaigns: { data: { campaigns_array: TCampaign[] } } = campaignsData 
        const qrs: { data: { qr_sets: TQRSet[] } } = qrsData 
        const collections: { data: { collections: TCollection[] } } = collectionsData 
        const dispensers: { data: { dispensers: TDispenser[] } } = dispensersData
        const { items } = qrManagerData.data
        dispatch(qrManagerActions.setItems(items))
        dispatch(colllectionsActions.setCollections(collections.data.collections.filter(collection => collection.chain_id === String(chainId))))
        dispatch(dispensersActions.setDispensers(dispensers.data.dispensers))
        dispatch(campaignsActions.updateCampaigns(campaigns.data.campaigns_array))
        dispatch(qrsActions.updateQrs(qrs.data.qr_sets))

        dispatch(campaignsActions.setLoading(false))
        dispatch(qrsActions.setLoading(false))
        dispatch(dispensersActions.setLoading(false))
        dispatch(colllectionsActions.setLoading(false))
        dispatch(qrManagerActions.setLoading(false))

      })

    } catch (err) {
      console.log(err)
      alertError('Error occured with data fetch, check console for information')
    }

    const sdk = new LinkdropBatchSDK({
      claimHostUrl: claimAppURL,
      apiHost: REACT_APP_SERVER_URL,
      apiKey: REACT_APP_ZUPLO_API_KEY as string
    })

    dispatch(userActions.setSDK(sdk))
  }
}

export default initialization
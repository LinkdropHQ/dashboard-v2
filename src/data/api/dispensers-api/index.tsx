import axios from 'axios'
import {
  TDispenser,
  TDispenserLinks,
  TDispenserWhitelistType
} from 'types'

const {
  REACT_APP_SERVER_URL,
  REACT_APP_ZUPLO_API_KEY
} = process.env

const dispensersApi = axios.create({
  baseURL: `${REACT_APP_SERVER_URL}/api/v2/dashboard`,
  headers: {
    Authorization: `Bearer ${REACT_APP_ZUPLO_API_KEY as string}`
  }
})

const requests = {
  create: (dispenser: TDispenser) => {
    return dispensersApi.post('/dispensers', dispenser, { withCredentials: true })
  },
  get: () => {
    return dispensersApi.get('/dispensers', { withCredentials: true })
  },
  getOne: (id: string | number) => {
    return dispensersApi.get(`/dispensers/${id}`, { withCredentials: true })
  },
  mapLinks: (id: string | number, links: TDispenserLinks, linksHasEqualContents: boolean) => {
    return dispensersApi.post(`/dispensers/${id}/upload-links`, {
      encrypted_claim_links: links,
      preview_setting: linksHasEqualContents ? 'token' : 'stub'
    }, { withCredentials: true })
  },
  updateLinks: (id: string | number, links: TDispenserLinks, linksHasEqualContents: boolean) => {
    return dispensersApi.put(`/dispensers/${id}/upload-links`, {
      encrypted_claim_links: links,
      preview_setting: linksHasEqualContents ? 'token' : 'stub'
    }, { withCredentials: true })
  },
  updateDispenserData: ({
    dispenser_id,
    title,
    archived,
    claim_start,
    claim_finish
  }: {
    dispenser_id: string,
    title?: string,
    archived?: boolean,
    claim_start?: number,
    claim_finish?: number | null
  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}`, {
      title,
      claim_start,
      claim_finish,
      archived
    }, { withCredentials: true })
  },
  getCampaignData: (
    multiscanQRId: string
  ) => {
    return dispensersApi.get(`/dispensers/multiscan-qrs/${multiscanQRId}/campaign`)
  },
  updateStatus: ({
    dispenser_id,
    active
  }: {
    dispenser_id: string,
    active: boolean
  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}/update-status`, {
      active
    }, { withCredentials: true })
  },
  updateRedirectOn: ({
    dispenser_id,
    redirect_on
  }: {
    dispenser_id: string,
    redirect_on: boolean
  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}/redirect-on`, {
      redirect_on
    }, { withCredentials: true })
  },

  updateTimeframeOn: ({
    dispenser_id,
    timeframe_on
  }: {
    dispenser_id: string,
    timeframe_on: boolean
  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}/timeframe-on`, {
      timeframe_on
    }, { withCredentials: true })
  },

  updateDispenserSettings: ({
    dispenser_id,
    app_title,
    app_title_on
  }: {
    dispenser_id: string,
    app_title?: string,
    app_title_on?: boolean

  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}`, {
      app_title,
      app_title_on
    }, { withCredentials: true })
  },
  updateRedirectUrl: ({
    dispenser_id,
    redirect_url
  }: {
    dispenser_id: string,
    redirect_url: string
  }) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}/redirect-link`, {
      redirect_url
    }, { withCredentials: true })
  },
  getReport: (
    dispenser_id: string | number
  ) => {
    return dispensersApi.get(`/dispensers/${dispenser_id}/report`, { withCredentials: true })
  },


  // whitelist
  updateWhitelist: (
    dispenser_id: string | number,
    whitelist_on?: boolean,
    whitelist_type?: TDispenserWhitelistType,
    whitelist?: string[]
  ) => {
    return dispensersApi.put(`/dispensers/${dispenser_id}/whitelist`, {
      whitelist_type,
      whitelist_on,
      whitelist
    }, {
      withCredentials: true
    })
  },

  updateWhitelistOn: (
    dispenser_id: string | number,
    whitelist_on: boolean
  ) => {
    return dispensersApi.patch(`/dispensers/${dispenser_id}/whitelist-on`, {
      whitelist_on
    }, {
      withCredentials: true
    })
  },

  getWhitelist: (
    dispenser_id: string | number
  ) => {
    return dispensersApi.get(`/dispensers/${dispenser_id}/whitelist`, {
      withCredentials: true
    })
  },

  createWhitelist: (
    dispenser_id: string | number,
    whitelist_on: boolean,
    whitelist_type: TDispenserWhitelistType,
    whitelist: string[]
  ) => {
    return dispensersApi.post(`/dispensers/${dispenser_id}/whitelist`, {
      whitelist_type,
      whitelist_on,
      whitelist
    }, {
      withCredentials: true
    })
  },

  updateReclaim: (
    dispenser_id: string | number,
    reclaim_app_id: string,
    reclaim_provider_id: string,
    reclaim_app_secret: string
  ) => {
    return dispensersApi.put(`/dispensers/${dispenser_id}/reclaim`, {
      reclaim_app_id,
      reclaim_provider_id,
      reclaim_app_secret
    }, {
      withCredentials: true
    })
  },
}

export default requests

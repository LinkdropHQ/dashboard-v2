import axios, { AxiosPromise } from 'axios'

const { REACT_APP_SERVER_URL } = process.env
const dashboardKeyApi = axios.create({
  baseURL: REACT_APP_SERVER_URL
})

type TGetKeyResponse = {
  success: boolean
  key_id: string
  sig_message: string, 
  encrypted_key?: string
}

const requests = {
  create: (encrypted_key: string, key_id: string) => {
    return dashboardKeyApi.post('dashboard-key', {
      encrypted_key, key_id
    }, { withCredentials: true })
  },
  get: () => {
    return dashboardKeyApi.get<TGetKeyResponse>(`dashboard-key`, { withCredentials: true })
  },
}

export default requests

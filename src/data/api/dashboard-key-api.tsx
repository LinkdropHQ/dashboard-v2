import axios, { AxiosPromise } from 'axios'

const { REACT_APP_SERVER_URL } = process.env
const dashboardKeyApi = axios.create({
  baseURL: REACT_APP_SERVER_URL
})

type TGetKeyResponse = {
  success: boolean
  key?: {
    key_id: string
    encrypted_key?: string
    encryption_scheme: string
  }
  
}

const requests = {
  create: (encrypted_key: string, key_id: string, encryption_scheme: string) => {
    console.log({ encrypted_key, key_id, encryption_scheme })
    return dashboardKeyApi.post('dashboard-key', {
      encrypted_key, key_id, encryption_scheme
    }, { withCredentials: true })
  },
  get: () => {
    return dashboardKeyApi.get<TGetKeyResponse>(`dashboard-key`, { withCredentials: true })
  },
}

export default requests

import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import * as userActions from '../actions'
import {
  UserActions,
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { encrypt } from './encrypt'
import { RootState } from 'data/store'
import { authorizationApi, dashboardKeyApi } from 'data/api'
import { generateKeyPair } from 'lib/crypto'
const ethUtil = require('ethereumjs-util');

const authorize = (
  address: string
) => {
  return async (dispatch: Dispatch<UserActions> & Dispatch<CampaignActions>, getState: () => RootState) => {
    const {
      user: {
        provider
      }
    } = getState()


    dispatch(campaignActions.setLoading(true))

    const timestamp = Date.now()
    const humanReadable = new Date(timestamp).toUTCString()

    try {
      const signer = await provider.getSigner()
      const message = `I'm signing this message to login to Linkdrop Dashboard at ${humanReadable}`
      const sig = await signer.signMessage(message)
      const authResponse = await authorizationApi.authorize(
        message,
        timestamp,
        sig,
        address.toLocaleUpperCase()
      )

      // dashboard key 
      const dashboardKeyData = await dashboardKeyApi.get()
      const { key: { encrypted_key, encryption_scheme, key_id } = {} } = dashboardKeyData.data
      if (!encrypted_key) {
        // register
        const {
          dashboard_key,
          encrypted_dashboard_key,
          key_id
        } = await createDashboardKey(
          provider,
          address
        )

        if (encrypted_dashboard_key && dashboard_key && key_id && encryption_scheme) {
          const { data: { success } } = await dashboardKeyApi.create(
            encrypted_dashboard_key,
            key_id,
            encryption_scheme
          )
          if (success) {
            dispatch(userActions.setDashboardKey(dashboard_key))
          }
        }
      } else {

        const decrypted_dashboard_key = await retrieveDashboardKey(
          provider,
          encrypted_key,
          address
        )

        dispatch(userActions.setDashboardKey(decrypted_dashboard_key))
      }

      //
      dispatch(campaignActions.setLoading(false))
      return message
    } catch (err) {
      console.error({ err })
      dispatch(campaignActions.setLoading(false))
      return null
    }
  }
}


const createDashboardKey: (
  provider: any,
  address: string
) => Promise<{ dashboard_key: string, encrypted_dashboard_key: string, key_id: string }> = async (
  provider,
  address
) => {
    const encryptionPublicKey = await provider.provider.request({
      method: 'eth_getEncryptionPublicKey',
      params: [address],
    })

    const { privateKey: dashboard_key, publicKey: key_id } = generateKeyPair()

    const encrypted = encrypt({
      publicKey: encryptionPublicKey,
      data: dashboard_key,
      version: 'x25519-xsalsa20-poly1305',
    })
    const encryptedString = JSON.stringify(encrypted)
    const encryptedBuff = Buffer.from(encryptedString, 'utf8')
    const encrypted_dashboard_key = ethUtil.bufferToHex(encryptedBuff)
    return {
      dashboard_key,
      encrypted_dashboard_key,
      key_id
    }
  }

const retrieveDashboardKey: (
  provider: any,
  encrypted_dashboard_key: string,
  address: string
) => Promise<string> = async (
  provider,
  encrypted_dashboard_key,
  address
) => {

    const decryptedKey = await provider.provider.request({
      method: 'eth_decrypt',
      params: [encrypted_dashboard_key, address],
    })

    return decryptedKey
  }

export default authorize

// get
// 4223502431
// 799be89db4a45876862dadb04f7b6afe546fc5d61b651208007eb906def5b045
// encrypted ip6cv+Mdmr94FHNHbtYwsCeQjUYkju6HY26+CgMwvrVtDaMAxAI7Ug0vWqneK+f+7YOE29pnZ6+3NL2kyik3/nGb+bYWRs8sBPbYQwewsDIsFTOh0uirsFnT9WM=
//

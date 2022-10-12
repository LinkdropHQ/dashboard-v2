import { Dispatch } from 'redux'
import * as campaignActions from 'data/store/reducers/campaign/actions'
import * as userActions from '../actions'

import {
  UserActions,
} from '../types'
import {
  CampaignActions
} from 'data/store/reducers/campaign/types'
import { RootState } from 'data/store'
import { authorizationApi, dashboardKeyApi } from 'data/api'
import { ethers } from 'ethers'
import { encrypt, decrypt, generateKeyPair } from 'lib/crypto' 
import { toString } from "uint8arrays/to-string"

const authorize = (
  address: string
) => {
  return async (dispatch: Dispatch<UserActions>  & Dispatch<CampaignActions>, getState: () => RootState) => {
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
      const { encrypted_key, sig_message, key_id } = dashboardKeyData.data
      if (!encrypted_key) {
        // register
        const {
          dashboard_key,
          encrypted_dashboard_key
        } = await createDashboardKey(
          signer,
          sig_message
        )

        if (encrypted_dashboard_key && dashboard_key) {
          const { data: { success } } = await dashboardKeyApi.create(
            encrypted_dashboard_key,
            key_id
          )
          if (success) {
            dispatch(userActions.setDashboardKey(dashboard_key))
          }
        }
      } else {

        const decrypted_dashboard_key = await retrieveDashboardKey(
          signer,
          encrypted_key,
          sig_message
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


const createDashboardKey: (signer: any, sig_message: string) => Promise<{ dashboard_key: string, encrypted_dashboard_key: string }> = async (
  signer,
  sig_message
) => {
  const signature = await signer.signMessage(sig_message)
  const signature_key = await ethers.utils.id(signature)
  const { privateKey: dashboard_key } = generateKeyPair()
  console.log({ dashboard_key })


  const signature_key_32 = signature_key.slice(0, 32)
  const signature_key_uint_8_array = new TextEncoder().encode(signature_key_32)
  const signature_key_as_base_16 = toString(signature_key_uint_8_array, 'base16')


  // revert signature_key_32
  // const signature_key_from_string = fromString(signature_key_as_base_16, 'base16')
  // const signature_key_32_decoded = new TextDecoder().decode(signature_key_from_string)  

  const encrypted_dashboard_key = encrypt(dashboard_key, signature_key_as_base_16)
  return {
    dashboard_key,
    encrypted_dashboard_key
  }
}

const retrieveDashboardKey: (
  signer: any,
  encrypted_dashboard_key: string,
  sig_message: string
) => Promise<string> = async (
  signer,
  encrypted_dashboard_key,
  sig_message
) => {
  const signature = await signer.signMessage(sig_message)
  const signature_key = await ethers.utils.id(signature)
  const signature_key_32 = signature_key.slice(0, 32)
  const signature_key_uint_8_array = new TextEncoder().encode(signature_key_32)
  const signature_key_as_base_16 = toString(signature_key_uint_8_array, 'base16')

  return decrypt(encrypted_dashboard_key, signature_key_as_base_16)
}

export default authorize


// get
// 4223502431
// 799be89db4a45876862dadb04f7b6afe546fc5d61b651208007eb906def5b045
// encrypted ip6cv+Mdmr94FHNHbtYwsCeQjUYkju6HY26+CgMwvrVtDaMAxAI7Ug0vWqneK+f+7YOE29pnZ6+3NL2kyik3/nGb+bYWRs8sBPbYQwewsDIsFTOh0uirsFnT9WM=
// 
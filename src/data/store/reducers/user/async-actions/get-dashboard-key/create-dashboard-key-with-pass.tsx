import { ethers } from 'ethers'
import { encrypt, generateKeyPair } from 'lib/crypto' 
import { toString } from "uint8arrays/to-string"
import { buf2hex } from 'helpers'

const createDashboardKeyWithPass: (
  sig_message: string,
  account: string
  ) => Promise<{
    dashboard_key: string,
    encrypted_dashboard_key: string
  } | void> = async (
  sig_message,
  account
) => {
  try {

    const challenge = Uint8Array.from(sig_message, c => c.charCodeAt(0))
    const user = {
      id: Uint8Array.from(
        account, c => c.charCodeAt(0)),
      name: `LINKDROP_ENCRYPTION_KEY_${account.slice(-6)}`,
      displayName: `LINKDROP_ENCRYPTION_KEY_${account.slice(-6)}`
    }
    const publicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: "Linkdrop",
        id: window.location.host.includes('localhost') ? 'localhost' : window.location.host,
      },
      user,
      pubKeyCredParams: [{alg: -7, type: "public-key"}, {alg: -257, type: "public-key"}],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
      },
      timeout: 60000,
      attestation: 'none'
    }
  
    const signature = await navigator.credentials.create({
        // @ts-ignore
        publicKey: publicKeyCredentialCreationOptions
    })

    // @ts-ignore
    const hex = buf2hex(signature?.rawId) 

    const signature_key = ethers.utils.id(hex as string)    
    const { privateKey: dashboard_key } = generateKeyPair()
    const signature_key_32 = signature_key.slice(0, 32)
    const signature_key_uint_8_array = new TextEncoder().encode(signature_key_32)
    const signature_key_as_base_16 = toString(signature_key_uint_8_array, 'base16')
    const encrypted_dashboard_key = encrypt(dashboard_key, signature_key_as_base_16)

    return {
      dashboard_key,
      encrypted_dashboard_key
    }
  } catch (err) {
    console.error({ err })
  }
}

export default createDashboardKeyWithPass
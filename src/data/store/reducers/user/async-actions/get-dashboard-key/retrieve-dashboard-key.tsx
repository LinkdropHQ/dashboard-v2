import { ethers } from 'ethers'
import { decrypt } from 'lib/crypto' 
import { toString } from "uint8arrays/to-string"
import { createWalletClient, custom } from 'viem'
import { defineWagmiNetwork } from 'helpers'

const retrieveDashboardKey: (
  provider: any,
  encrypted_dashboard_key: string,
  sig_message: string,
  account: string,
  chain_id: number
) => Promise<string | void> = async (
  provider,
  encrypted_dashboard_key,
  sig_message,
  account,
  chain_id
) => {
  const network = defineWagmiNetwork(chain_id)

  try {
    const walletClient = createWalletClient({
      chain: network,
      transport: custom(provider),
    })

    // const signature = await signer.signMessage(String(sig_message))
    let signature = await walletClient.signMessage({ 
      account: account as `0x${string}`,
      message: sig_message
    })

    const signature_key = ethers.utils.id(signature)

    const signature_key_32 = signature_key.slice(0, 32)

    const signature_key_uint_8_array = new TextEncoder().encode(signature_key_32)

    const signature_key_as_base_16 = toString(signature_key_uint_8_array, 'base16')


    return decrypt(encrypted_dashboard_key, signature_key_as_base_16) 
  } catch (err) {
    console.error({ err })
  }
}

export default retrieveDashboardKey
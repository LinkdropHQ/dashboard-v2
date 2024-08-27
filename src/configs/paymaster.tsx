import { createPublicClient, http } from 'viem'
import { toCoinbaseSmartAccount } from 'viem/account-abstraction'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const {
  REACT_APP_PAYMASTER_BASE_JSON_RPC,
  REACT_APP_PAYMASTER_PRIVATE_KEY,
} = process.env

const paymasterConfig = async () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as `0x${string}`),
  })
   
  const owner = privateKeyToAccount(REACT_APP_PAYMASTER_PRIVATE_KEY as `0x${string}`)
   
  const account = await toCoinbaseSmartAccount({ 
    client, 
    owners: [owner]
  }) 

  return {
    client,
    account
  }
}

export default paymasterConfig 

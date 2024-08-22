import { http, createPublicClient } from "viem";
import { base } from "viem/chains";
import { createSmartAccountClient } from "permissionless"
import { privateKeyToSimpleSmartAccount } from "permissionless/accounts"
import { createPimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { alertError } from "helpers";

const {
  REACT_APP_PAYMASTER_BASE_JSON_RPC,
  REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06,
  REACT_APP_PAYMASTER_PRIVATE_KEY,
  REACT_APP_PAYMASTER_BASE_FACTORY
} = process.env


const publicClient = createPublicClient({
  chain: base,
  transport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as string),
})

let paymaster: null | any = null

const getCoinbasePaymaster = async () => {
  if (paymaster) return paymaster
  try {
    const simpleAccount = await privateKeyToSimpleSmartAccount(publicClient, {
      privateKey: REACT_APP_PAYMASTER_PRIVATE_KEY as `0x${string}`,
      factoryAddress: REACT_APP_PAYMASTER_BASE_FACTORY as `0x${string}`,
      entryPoint: REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06 as any
    })
  
    const cloudPaymaster = createPimlicoPaymasterClient({
      chain: base,
      transport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as string),
      entryPoint: REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06 as any
    });
    
    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: base,
      bundlerTransport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as string),
      // IMPORTANT: Set up Cloud Paymaster to sponsor your transaction
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    })
    paymaster = smartAccountClient
    return smartAccountClient
  } catch (e) {
    alertError('Cannot create Coinbase Paymaster. Please check console')
  }
  
}

export default getCoinbasePaymaster
 import paymasterConfig from 'configs/paymaster'
 import { http } from 'viem'
 import { base } from 'viem/chains'
 import { alertError } from 'helpers'
 import { 
   createBundlerClient, 
   createPaymasterClient,
 } from 'viem/account-abstraction'

const {
  REACT_APP_PAYMASTER_BASE_JSON_RPC,
  REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06
} = process.env

const getCoinbasePaymaster = async (
  callData: `0x${string}`,
  // factory address
  targetContract: `0x${string}`
) => {

  try {
    const {
      client,
      account
    } = await paymasterConfig()
  
    const bundlerClient = createBundlerClient({
      account,
      client,
      transport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as `0x${string}`),
      chain: base,
    })
    
    const paymasterClient = createPaymasterClient({
      transport: http(REACT_APP_PAYMASTER_BASE_JSON_RPC as `0x${string}`)
    })

    const encodedCalls = await account.encodeCalls([
      {
        to: targetContract,
        data: callData,
        value: BigInt(0)
      },
    ])
    
    // @ts-ignore
    const paymasterStub = await paymasterClient.getPaymasterStubData({
      sender: account.address,
      callData: encodedCalls,
      chainId: base.id,
      entryPointAddress: REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06 as `0x${string}`,
    })
    
    // Prepare the user operation (estimates gas, fills in other fields)
    const userOperation = await bundlerClient.prepareUserOperation({
      callData: encodedCalls,
      paymasterAndData: paymasterStub.paymasterAndData,
    });

    // Pad gas values so that the transaction is more likely to be accepted
    userOperation.preVerificationGas =
      (userOperation.preVerificationGas * BigInt(3)) / BigInt(2);
    userOperation.callGasLimit =
      (userOperation.callGasLimit * BigInt(3)) / BigInt(2);
    
    // Get the final signed paymasterAndData 
    const signedPaymasterData = await paymasterClient.getPaymasterData({
      chainId: base.id,
      entryPointAddress: REACT_APP_PAYMASTER_BASE_ENTRYPOINT_V06 as `0x${string}`,
      ...userOperation,
    })
    
    return {
      userOperation,
      signedPaymasterData,
      bundlerClient,
      account
    }
  

  } catch (err) {
    alertError('Cannot create Coinbase Paymaster. Please check console')
    console.log({
      err
    })
  }
  
}

export default getCoinbasePaymaster
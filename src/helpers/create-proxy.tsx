import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import contracts from 'configs/contracts'

type TCreateProxy = (
  chainId: number,
  address: string,
  campaignId: string,
  sdk: LinkdropBatchSDK | null
) => Promise<void | string>

const createProxy: TCreateProxy = async (
  chainId,
  address,
  campaignId,
  sdk
) => {
  if (!sdk) {
    return
  }
  const contract = contracts[chainId]
  if (!contract) {
    return
  }
  const proxyContractAddress = await sdk.utils.computeProxyAddress(
    contract.factory,
    address,
    campaignId
  )
  if (!proxyContractAddress) { return }

  return proxyContractAddress
}

export default createProxy

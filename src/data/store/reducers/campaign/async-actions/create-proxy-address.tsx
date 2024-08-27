import contracts from 'configs/contracts'
import { Dispatch } from 'redux'
import { CampaignActions } from '../types'
import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import * as actionsCampaign from '../actions'

const createProxyAddress = async (
  dispatch: Dispatch<CampaignActions>,
  chainId: number,
  sdk: LinkdropBatchSDK | null,
  address: string
) => {
  const contract = contracts[chainId]
  const campaignId = String(+(new Date()))
  const proxyContractAddress = await sdk?.utils.computeProxyAddress(
    contract.factory,
    address,
    campaignId
  )

  if (!proxyContractAddress) { return }
  dispatch(actionsCampaign.setProxyContractAddress(proxyContractAddress))
  dispatch(actionsCampaign.setId(campaignId))
}

export default createProxyAddress
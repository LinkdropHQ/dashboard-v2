import contracts from 'configs/contracts'
import { Dispatch } from 'redux'
import { CampaignActions } from '../types'
import LinkdropBatchSDK from 'linkdrop-batch-sdk'
import * as actionsCampaign from '../actions'
import { create2Address } from 'helpers'
import { ZK_STACK_INITCODE } from 'configs/app'
import {
  utils,
} from 'ethers5'
const {
  solidityKeccak256
} = utils

const createProxyAddress = async (
  dispatch: Dispatch<CampaignActions>,
  chainId: number,
  sdk: LinkdropBatchSDK | null,
  address: string
) => {
  const contract = contracts[chainId]
  const zkStack = contract.zk_stack
  const campaignId = String(+(new Date()))
  let proxyAddress
  if (zkStack) {
    const salt = solidityKeccak256(
        ['address', 'uint256'],
        [address, campaignId]
    )
    // 2. Pass this data to the `create2Address` function
    const input = "0x"; // If there are no constructor arguments
    proxyAddress = create2Address(contract.factory, ZK_STACK_INITCODE, salt, input)
  } else {
    proxyAddress = await sdk?.utils.computeProxyAddress(
      contract.factory,
      address,
      campaignId
    )
  }

  if (!proxyAddress) { return }
  dispatch(actionsCampaign.setProxyContractAddress(proxyAddress))
  dispatch(actionsCampaign.setId(campaignId))
}

export default createProxyAddress
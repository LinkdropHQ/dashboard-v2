import { Dispatch } from 'redux';
import * as actionsCollections from '../actions'
import { CollectionsActions } from '../types'
import { UserActions } from '../../user/types'
import { IAppDispatch } from 'data/store'
import { alertError } from 'helpers'
import { RootState } from 'data/store'
import { createThirdwebClient, defineChain } from "thirdweb"
  
import { ethers6Adapter } from "thirdweb/adapters/ethers6"

import { deployPublishedContract } from "thirdweb/deploys"
import { collectionsApi } from 'data/api'
import { TCollection } from 'types'
import { THIRDWEB_CONTRACT_ID, THIRDWEB_PUBLISHER } from 'configs/collections'
import { Config, getConnectorClient } from '@wagmi/core'
import { BrowserProvider, JsonRpcSigner, JsonRpcProvider } from 'ethers'
import { config } from 'components/application/connectors'

import type { Account, Chain, Client, Transport } from 'viem'

async function getEthersSigner(
  config: Config,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId })
  return clientToSigner(client)
}


function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}



const { REACT_APP_THIRDWEB_CLIENT_ID } = process.env

function createCollectionERC1155(
  title: string,
  symbol: string,
  callback?: (collection_id: string) => void
) {
  // @ts-ignore
  return async (
    dispatch: Dispatch<CollectionsActions> & Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    dispatch(actionsCollections.setLoading(true))
    const { user: { chainId, address } } = getState()

    const signer6 = await getEthersSigner(config)
    const account = await ethers6Adapter.signer.fromEthers({ signer: signer6 })


    try {
      const chain = defineChain(Number(chainId))

      if (!chain) {
        return alertError('Network is not supported')
      }



      const client = createThirdwebClient({
        clientId: REACT_APP_THIRDWEB_CLIENT_ID as string
      })

      // @ts-ignore
      const address = await deployPublishedContract({
        client,
        chain,
        contractId: THIRDWEB_CONTRACT_ID,
        contractParams: {
          _defaultAdmin: account.address,
          _name: title,
          _symbol: symbol
        },
        publisher: THIRDWEB_PUBLISHER,
        account
      })

      const result: {
        data: {
          success: boolean,
          collection: TCollection
        }
      } = await collectionsApi.create({
        title,
        symbol,
        sbt: true,
        token_standard: 'ERC1155',
        token_address: address,
        chain_id: String(chainId)
      })

      if (result.data.success) {
        dispatch(actionsCollections.addCollection(result.data.collection))

        if (callback) {
          callback(result.data.collection.collection_id as string)
        }
      }

    } catch (err) {
      console.error({
        err
      })
      alertError('Some error occured. Please check console for more info')
    }
    dispatch(actionsCollections.setLoading(false))
  }
}

export default createCollectionERC1155

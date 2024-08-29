import { Dispatch } from 'redux';
import * as actionsCollections from '../actions'
import { CollectionsActions } from '../types'
import { UserActions } from '../../user/types'
import { IAppDispatch } from 'data/store'
import { alertError } from 'helpers'
import { RootState } from 'data/store'
import { createThirdwebClient, getContract, defineChain, prepareContractCall, sendTransaction, readContract } from "thirdweb";
import { nextTokenIdToMint, mintTo } from "thirdweb/extensions/erc1155";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { collectionsApi } from 'data/api'
import { TCollectionToken, TCollection } from 'types'
const { REACT_APP_THIRDWEB_CLIENT_ID } = process.env


function createTokenERC1155(
  collectionId: string,
  contractAddress: string,
  tokenName: string,
  description: string,
  copiesAmount: string,
  properties: Record<string, string>,
  file?: File,
  thumbnail?: string,
  callback?: () => void
) {
  // @ts-ignore
  return async (
    dispatch: Dispatch<CollectionsActions> & Dispatch<UserActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    dispatch(actionsCollections.setLoading(true))
    const { user: { chainId, address, signer }, collections: { collections } } = getState()

    try {
      const chain = defineChain(Number(chainId))

      if (!chain) {
        return alertError('Network is not supported')
      }

      const account = await ethers5Adapter.signer.fromEthers({ signer });

      const client = createThirdwebClient({
        clientId: REACT_APP_THIRDWEB_CLIENT_ID as string
      });

      const contractInstance = await getContract({ client, chain, address: contractAddress })

      const nft = {
        name: tokenName,
        description: description,
        image: file,
        attributes: Object.entries(properties).map(([key, value]) => ({
          trait_type: key,
          value: value
        }))
      }

      const nextTokenId = await nextTokenIdToMint({ contract: contractInstance })

      const transaction = await mintTo({
        contract: contractInstance,
        to: account.address,
        supply: 0n,
        nft
      })
      const txResult = await sendTransaction({
        transaction,
        account
      });

      const result: { data: { success: boolean, token: TCollectionToken } } = await collectionsApi.addToken(collectionId, {
        name: tokenName,
        description,
        copies: String(copiesAmount),
        properties,
        token_id: String(nextTokenId),
        thumbnail
      })

      if (result.data.success) {
        const collections: { data: { collections: TCollection[] } } = await collectionsApi.get()
        dispatch(actionsCollections.setCollections(collections.data.collections))

        if (callback) {
          callback()
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

export default createTokenERC1155

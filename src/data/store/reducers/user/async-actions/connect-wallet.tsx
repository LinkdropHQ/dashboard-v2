import { Dispatch } from 'redux'
import * as actions from '../actions'
import * as asyncActions from '../async-actions'
import {
  UserActions
} from '../types'
import Web3Modal from "web3modal"
import { Web3Provider } from '@ethersproject/providers'
import WalletConnectProvider from "@walletconnect/web3-provider"
import { IAppDispatch } from 'data/store';
import {
  initialization,
  getNativeTokenAmount
 } from './index'
 const { REACT_APP_INFURA_ID } = process.env

async function connectWallet (dispatch: Dispatch<UserActions> & IAppDispatch) {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: REACT_APP_INFURA_ID,
        qrcode: true
      }
    }
  };
  const web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions // required
  })
  const provider = await web3Modal.connect();

  const providerWeb3 = new Web3Provider(provider, 'any')
  
  let { chainId } = await providerWeb3.getNetwork()
  // if (chainId !== 4) {
  //   return alert('Currently only Rinkeby is available.')
  // }
  
  const accounts = await providerWeb3.listAccounts()
  const address = accounts[0] && accounts[0].toLowerCase()
  dispatch(actions.setProvider(providerWeb3))

  const result: string | null = await dispatch(asyncActions.authorize(address))

  if (!result) {
    return alert('authorization was declined')
  }


  dispatch(actions.setAddress(address))
  dispatch(actions.setChainId(chainId))
  
  dispatch(initialization(chainId, address))

  await getNativeTokenAmount(
    dispatch,
    chainId,
    address,
    providerWeb3
  )

  provider.on("accountsChanged", async (accounts: string[]) => {
    const address = accounts[0] && accounts[0].toLowerCase()
    dispatch(actions.setAddress(''))
    const result: string | null = await dispatch(asyncActions.authorize(address))
    if (!result) {
      return alert('authorization was declined')
    }

    dispatch(actions.setAddress(address))
    dispatch(initialization(chainId, address))
    await getNativeTokenAmount(
      dispatch,
      chainId,
      address,
      providerWeb3
    )
  })
  
  // Subscribe to chainId change
  provider.on("chainChanged", async (chainId: string) => {
    let chainIdConverted = parseInt(chainId, 16);
    dispatch(actions.setChainId(chainIdConverted))
    dispatch(initialization(Number(chainId), address))
    await getNativeTokenAmount(
      dispatch,
      chainIdConverted,
      address,
      providerWeb3
    )
  })
}

// const authorize = async (provider: any) => {
//   const signer = await provider.getSigner()
//   const message = await signer.signMessage(`I’m signing this message to login to Linkdrop Dashboard at ${new Date()}`)
//   console.log({ message })
// }

export default connectWallet
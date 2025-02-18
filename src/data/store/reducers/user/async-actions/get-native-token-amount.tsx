import * as actions from '../actions'
import {
  TGetNativeTokenBalance
} from '../types'
import { utils } from 'ethers5'
import { alertError } from 'helpers'

const getNativeTokenAmount: TGetNativeTokenBalance = async (
  dispatch,
  chainId,
  address,
  provider
) => {
  try {
    const nativeTokenAmount = await provider.getBalance(address)
    dispatch(actions.setNativeTokenAmount(nativeTokenAmount))
  } catch (err) {
    alertError('Error with native tokens amount fetch, check console for information')
    console.error({
      err
    })
  }
}

export default getNativeTokenAmount
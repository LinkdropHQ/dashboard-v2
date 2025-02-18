import * as actions from '../actions'
import {
  TGetTokenBalance
} from '../types'
import { utils } from 'ethers5'

const getTokenAmount: TGetTokenBalance = async (
  dispatch,
  address,
  decimals,
  contractInstance
) => {
  try {
    const tokenAmount = await contractInstance.balanceOf(address)
    dispatch(actions.setTokenAmount(tokenAmount))
  } catch (err) {
    console.log({
      err
    })
  } 
}

export default getTokenAmount
import { TAssetsData } from 'types'
import { BigNumber, utils } from 'ethers5'

const countNativeTokensToSecure = (
  nativeTokensAmount: string,
  assets: TAssetsData,
  comissionPrice: string,
  sponsored: boolean
) => {
  const nativeTokensAmountFormatted = utils.parseEther(nativeTokensAmount || '0')
  const comission = utils.parseEther(comissionPrice || '0')
  const totalNativeTokensAmount = BigNumber.from(nativeTokensAmountFormatted).mul(assets.length)
  const potentialComission = comission.mul(assets.length)
  const totalComission = sponsored ? potentialComission : BigNumber.from(0)

  const totalNativeTokensAmountToSecure = !sponsored ? totalNativeTokensAmount : totalNativeTokensAmount.add(totalComission)
  return {
    totalNativeTokensAmount,
    totalComission,
    totalNativeTokensAmountToSecure,
  }
}
export default countNativeTokensToSecure
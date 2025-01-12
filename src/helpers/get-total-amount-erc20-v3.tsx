import { TLink, TTotalAmountERC20 } from 'types'
import { BigNumberish, utils, BigNumber } from 'ethers'

type TGetTotalAmountERC20 = (
  links: TLink[],
  decimals: number
) => TTotalAmountERC20

const getTotalAmountERC20: TGetTotalAmountERC20 = (
  links,
  decimals
) => {
  console.log('ssss')

  let totalAmount = BigNumber.from('0')
  let weiAmount = BigNumber.from('0')
  links.forEach(link => {
    console.log({ link })
    if (link.token_amount) {
      totalAmount = totalAmount.add(link.token_amount) // NOT FORMATTED
      weiAmount = weiAmount.add(String(link.wei_amount))
    }
  })

  return {
    wei_amount_original: weiAmount,
    amount_original: totalAmount,
    amount_formatted: utils.formatUnits(totalAmount, decimals),
    wei_amount_formatted: utils.formatUnits(weiAmount, 18)
  }
}

export default getTotalAmountERC20

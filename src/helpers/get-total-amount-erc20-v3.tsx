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
  let totalAmount = BigNumber.from('0')
  let totalAmountFormatted = BigNumber.from('0')
  let weiAmount = BigNumber.from('0')
  let weiAmountFormatted = BigNumber.from('0')

  links.forEach(link => {
    if (link.token_amount) {
      totalAmountFormatted = totalAmountFormatted.add(utils.formatUnits(link.token_amount, decimals))
      totalAmount = totalAmount.add(BigNumber.from(link.token_amount))
      weiAmount = weiAmount.add(BigNumber.from(link.wei_amount))
      weiAmountFormatted = weiAmountFormatted.add(utils.formatUnits(link.wei_amount || '0', 18))
    }
  })

  return {
    amount_formatted: totalAmountFormatted,
    amount_original: totalAmount,
    wei_amount_formatted: weiAmountFormatted,
    wei_amount_original: weiAmount
  }
}

export default getTotalAmountERC20

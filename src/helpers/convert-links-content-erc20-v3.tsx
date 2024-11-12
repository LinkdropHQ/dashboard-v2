import { TAssetsData } from 'types'
import { utils } from 'ethers'

type TConvertLinksContentERC20V3 = (
  amountPerClaim: string,
  claimsAmount: string,
  decimals: number
) => TAssetsData

const convertLinksContentERC20V3: TConvertLinksContentERC20V3 = (
  amountPerClaim,
  claimsAmount,
  decimals
) => {
  let result: TAssetsData = []

  const amountOfLinks = Number(claimsAmount)
  for (let i = 0; i < amountOfLinks; i++) {
    result.push({
      amount: String(
        utils.parseUnits(amountPerClaim, decimals)
      ),
      original_amount: amountPerClaim
    })
  }
  return result
}

export default convertLinksContentERC20V3

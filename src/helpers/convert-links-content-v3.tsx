import { TLinkContent, TAssetsData, TClaimPattern } from 'types'
import { utils, BigNumber } from 'ethers'
import { getBignumberInterval } from 'helpers'
// export type TAsset = {
//   amount?: string,
//   id?: number | string,
//   native_tokens_amount?: string,
//   original_amount?: string,
//   original_native_tokens_amount?: string
// }

type TConvertLinksContentV3 = (
  linksContents: TLinkContent[],
  decimals: number
) => TAssetsData
const convertLinksContent: TConvertLinksContentV3 = (
  linksContents,
  decimals
) => {
  let result: TAssetsData = []
  linksContents.forEach((item: TLinkContent) => {
    if (item.type === 'ERC1155') {
      const amountOfLinks = Number(item.linksAmount)
      for (let i = 0; i < amountOfLinks; i++) {
        result.push({
          amount: item.tokenAmount,
          id: item.tokenId,
          original_amount: item.tokenAmount
        })
      }
    } else if (item.type === 'ERC721') {
      result.push({
        id: item.tokenId
      })
    } else {
      const amountOfLinks = Number(item.linksAmount)
      for (let i = 0; i < amountOfLinks; i++) {
        result.push({
          amount: String(utils.parseUnits(String(item.tokenAmount), decimals)),
          original_amount: item.tokenAmount
        })
      }
    }
  })
  return result
}

export default convertLinksContent

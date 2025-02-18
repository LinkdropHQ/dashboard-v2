import { TLinkContent, TAssetsData, TClaimPattern } from 'types'
import { utils, BigNumber } from 'ethers5'
import { getBignumberInterval } from 'helpers'
// export type TAsset = {
//   amount?: string,
//   id?: number | string,
//   native_tokens_amount?: string,
//   original_amount?: string,
//   original_native_tokens_amount?: string
// }

type TConvertLinksContent = (
  linksContents: TLinkContent[],
  decimals: number,
  claimPattern: TClaimPattern,
  sdk: boolean
) => TAssetsData
const convertLinksContent: TConvertLinksContent = (linksContents, decimals, claimPattern, sdk) => {
  let result: TAssetsData = []
  linksContents.forEach((item: TLinkContent) => {
    if (sdk) {
      if (!item.tokenId) { return result }
      const {
        suffix,
          limit,
          prefixOffset
      } = getBignumberInterval('0', item.tokenId)
      result = [...result, ...Array.from({ length: limit }, (_, i) => {
        const additional = BigNumber.from(suffix).add(BigNumber.from(i))
        const final = BigNumber.from(prefixOffset).add(additional)
        return {
          id: String(final)
        }
      })]
    }
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
      if (claimPattern === 'mint') {
        if (!item.tokenId) { return result }
        const {
          suffix,
            limit,
            prefixOffset
        } = getBignumberInterval('0', item.tokenId)
        result = [...result, ...Array.from({ length: limit }, (_, i) => {
          const additional = BigNumber.from(suffix).add(BigNumber.from(i))
          const final = BigNumber.from(prefixOffset).add(additional)
          return {
            id: String(final)
          }
        })]
      } else {
        
        if (item.tokenId && item.tokenId.includes('-')) {
          const tokenIds = item.tokenId.split('-').map(item => item.trim())
          const {
            suffix,
            limit,
            prefixOffset
          } = getBignumberInterval(tokenIds[0], tokenIds[1])

          result = [...result, ...Array.from({ length: limit + 1 }, (_, i) => {
            const additional = BigNumber.from(suffix).add(BigNumber.from(i))
            const final = BigNumber.from(prefixOffset).add(additional)
            return {
              id: String(final)
            }
          })]
        
        } else {
          result.push({
            id: item.tokenId
          })
        }
      }
      
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

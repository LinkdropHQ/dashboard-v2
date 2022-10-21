
import {
  TDefineTotalAmountERC721,
  TTotalAmount,
  TAsset
} from 'types'
import { add, bignumber } from 'mathjs'

const countAssetsTotalAmountERC721: TDefineTotalAmountERC721 = (assets) => {
  return assets.reduce<TTotalAmount>((sum: TTotalAmount, item: TAsset) => {
    const { native_tokens_amount, original_native_tokens_amount, id } = item

    const updatedNativeTokensAmount = native_tokens_amount && native_tokens_amount !== '0' ? add(
      bignumber(item.native_tokens_amount),
      bignumber(sum.native_tokens_amount)
    ) : sum.native_tokens_amount

    const updatedOriginalNativeTokensAmount = original_native_tokens_amount && original_native_tokens_amount !== '0' ? add(
      bignumber(item.original_native_tokens_amount),
      bignumber(sum.original_native_tokens_amount)
    ) : sum.original_native_tokens_amount

    const updatedIds = id && !(sum.ids || []).includes(id) ? [...(sum.ids || []), id] : sum.ids
    return {
      ...sum,
      ids: updatedIds,
      native_tokens_amount: updatedNativeTokensAmount,
      original_native_tokens_amount: updatedOriginalNativeTokensAmount
    }  
  }, {
    native_tokens_amount: bignumber('0'),
    ids: [],
    original_native_tokens_amount: bignumber('0')
  })
}

export default countAssetsTotalAmountERC721
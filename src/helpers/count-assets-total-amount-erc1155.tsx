
import {
  TDefineTotalAmountERC721,
  TTotalAmount,
  TAsset
} from 'types'
import { add, bignumber } from 'mathjs'

const countAssetsTotalAmountERC1155: TDefineTotalAmountERC721 = (assets) => {
  return assets.reduce<TTotalAmount>((sum: TTotalAmount, item: TAsset) => {
    const { native_tokens_amount, original_native_tokens_amount, id, amount, original_amount } = item
    const updatedAmount = amount && original_amount !== '0' ? add(
      bignumber(item.amount),
      bignumber(sum.amount)
    ) : sum.amount

    const updatedOriginalAmount = original_amount && original_amount !== '0' ? add(
      bignumber(item.original_amount),
      bignumber(sum.original_amount)
    ) : sum.original_amount

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
      amount: updatedAmount,
      original_amount: updatedOriginalAmount,
      native_tokens_amount: updatedNativeTokensAmount,
      original_native_tokens_amount: updatedOriginalNativeTokensAmount
    }
  }, {
    native_tokens_amount: bignumber('0'),
    ids: [],
    original_native_tokens_amount: bignumber('0'),
    amount: bignumber('0'),
    original_amount: bignumber('0')
  })
}

export default countAssetsTotalAmountERC1155
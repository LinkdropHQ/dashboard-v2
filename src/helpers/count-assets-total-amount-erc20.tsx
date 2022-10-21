
import {
  TDefineTotalAmountERC20,
  TTotalAmount,
  TAsset
} from 'types'
import { add, bignumber } from 'mathjs'

const countAssetsTotalAmountERC20: TDefineTotalAmountERC20 = (assets) => {
  return assets.reduce<TTotalAmount>((sum: TTotalAmount, item: TAsset) => {
    const { native_tokens_amount, amount, original_amount, original_native_tokens_amount } = item
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

    return {
      ...sum,
      amount: updatedAmount,
      original_amount: updatedOriginalAmount,
      native_tokens_amount: updatedNativeTokensAmount,
      original_native_tokens_amount: updatedOriginalNativeTokensAmount
    }  
  }, {
    native_tokens_amount: bignumber('0'),
    amount: bignumber('0'),
    original_native_tokens_amount: bignumber('0'),
    original_amount: bignumber('0')
  })
}

export default countAssetsTotalAmountERC20
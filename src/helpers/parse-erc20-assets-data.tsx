import { checkERC20AssetsData } from './index'
import {
  TAsset,
} from 'types'
import { utils } from 'ethers';

type TResultERC20 = (data: string, decimals: number) => TAsset[] | null

const parseERC20AssetsData: TResultERC20 = (data, decimals) => {
  // [
  //   '0.002',
  //   '0.002'(20)
  //   '0.001, 0.001(20)',
  //   '0.001, 0.001',
  // ]

  if (!data) {
    return null
  }

  const recipientsFormatValid = checkERC20AssetsData(data)
  if (!recipientsFormatValid) {
    return null
  }
  const links = data.split('\n')
  // [
  //   '0.002',
  //   '0.002(20)'
  // ]

  const recipientsData = links.reduce<TAsset[]>((memo, item: string) => {
    const itemSplit = item.split(',')
      .map((item: string) => item.trim())
      .filter(item => item)
    let assets: TAsset[] = []
    if (itemSplit.length === 1) { //['0.002'] + ['0.002'(20)]
      assets = parseSingleDataERC20(itemSplit[0], decimals)
      
    } else if (itemSplit.length === 2) { //['0.001, 0.001(20)'] + ['0.001, 0.001']
      assets = parseDoubleDataERC20(item, decimals)
    }
    return [
      ...memo,
      ...assets
    ]
  }, [])
  return recipientsData
}

const parseSingleDataERC20: (value: string, decimals: number) => TAsset[] = (value, decimals) => {
  let result = []
  if (value.includes('(') && value.includes(')')) {
    const valueAndAmount = value.replace(/\)/i, '').split('(').map((item: string) => item.trim())

    result = new Array(Number(valueAndAmount[1])).fill({
      amount: String(utils.parseUnits(String(valueAndAmount[0]), decimals)),
      original_amount: String(valueAndAmount[0]),
      native_tokens_amount: '0',
      original_native_tokens_amount: '0'
    })
  } else {
    result.push({
      amount: String(utils.parseUnits(String(value), decimals)),
      original_amount: String(value),
      native_tokens_amount: '0',
      original_native_tokens_amount: '0'
    })
  }
  return result
}

const parseDoubleDataERC20: (value: string, decimals: number) => TAsset[] = (value, decimals) => {
  let result = []
  if (value.includes('(') && value.includes(')')) {
    const valueAndAmount = value.replace(/\)/i, '').split('(').map((item: string) => item.trim())
    const [ tokensValue, nativeTokensAmount ] = valueAndAmount[0].split(',').map(item => item.trim())
    result = new Array(Number(valueAndAmount[1])).fill({
      amount: String(utils.parseUnits(String(tokensValue), decimals)),
      original_amount: String(tokensValue),
      native_tokens_amount: String(utils.parseUnits(String(nativeTokensAmount), 18)),
      original_native_tokens_amount: String(nativeTokensAmount)
    })
  } else {
    const [ tokensValue, nativeTokensAmount ] = value.split(',').map(item => item.trim())
    result.push({
      amount: String(utils.parseUnits(String(tokensValue), decimals)),
      original_amount: String(tokensValue),
      native_tokens_amount: String(utils.parseUnits(String(nativeTokensAmount), 18)),
      original_native_tokens_amount: String(nativeTokensAmount)
    })
  }
  return result
}

export default parseERC20AssetsData

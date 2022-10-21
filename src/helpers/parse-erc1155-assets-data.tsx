import {
  TAsset
} from 'types'
import { utils } from 'ethers';
import checkERC1155AssetsData from './check-erc1155-assets-data';

type TResultERC1155 = (data: string) => TAsset[] | null

const parseERC1155AssetsData: TResultERC1155 = (data) => {
  // [
  //   '0.002',
  //   '0.002'(20)
  //   '0.001, 0.001(20)',
  //   '0.001, 0.001',
  // ]

  if (!data) {
    return null
  }

  const recipientsFormatValid = checkERC1155AssetsData(data)
  if (!recipientsFormatValid) {
    return null
  }
  const links = data.split('\n')
  // [
  //   '0.002',
  //   '0.002(20)'
  // ]

  const recipientsData = links.reduce<TAsset[]>((memo, item: string) => {
    const itemSplit = item.split(',').map((item: string) => item.trim())
     // ['1', '10']
    let assets: TAsset[] = []
    if (itemSplit.length === 2) {
      assets = parseSingleDataERC1155(item)
    } else if (itemSplit.length === 3)
      assets = parseSingleDataERC1155WithNative(item)
    return [
      ...memo,
      ...assets
    ]
  }, [])
  return recipientsData
}

const parseSingleDataERC1155: (value: string) => TAsset[] = (value) => {
  let result = []
  
  if (value.includes('(') && value.includes(')')) {
    // '1, 2(2)'
    const valueAndAmount = value.replace(/\)/i, '').split('(').map((item: string) => item.trim()).filter(item => item)
    const [ id, amount ] = valueAndAmount[0].split(',').map((item: string) => item.trim())
    result = new Array(Number(valueAndAmount[1])).fill({
      id: String(id || 0),
      amount: String(amount || 0),
      native_tokens_amount: '0'
    })

  } else {
    // '1, 2'
    const [ id, amount ] = value.split(',').map((item: string) => item.trim())
    result.push({
      id: String(id || 0),
      amount: String(amount || 0),
      native_tokens_amount: '0'
    })
  }
  return result
}

const parseSingleDataERC1155WithNative: (value: string) => TAsset[] = (value) => {
  let result = []
  if (value.includes('(') && value.includes(')')) {
    const valueAndAmount = value.replace(/\)/i, '').split('(').map((item: string) => item.trim()).filter(item => item)
    const [ id, amount, nativeTokensAmount ] = valueAndAmount[0].split(',').map(item => item.trim()).filter(item => item)
    result = new Array(Number(valueAndAmount[1])).fill({
      amount: String(amount || 0),
      id: String(id || 0),
      native_tokens_amount: String(utils.parseUnits(String(nativeTokensAmount), 18))
    })
  } else {
    const [ id, amount, nativeTokensAmount ] = value.split(',').map(item => item.trim()).filter(item => item)
    result.push({
      id: String(id || 0),
      amount: String(amount || 0),
      native_tokens_amount: nativeTokensAmount ? String(utils.parseUnits(String(nativeTokensAmount), 18)) : '0'
    })
  }
  return result
}

export default parseERC1155AssetsData

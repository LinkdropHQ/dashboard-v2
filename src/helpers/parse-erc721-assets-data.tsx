import { checkERC721AssetsData } from './index'
import {
  TAsset,
} from 'types'
import { utils } from 'ethers'
import { getBignumberInterval } from 'helpers'

type TResultERC721 = (data: string) => TAsset[] | null

const parseERC721AssetsData: TResultERC721 = (data) => {
  if (!data) {
    return null
  }

  const recipientsFormatValid = checkERC721AssetsData(data)
  if (!recipientsFormatValid) {
    return null
  }
  const links = data.split('\n')
  // [
  // '1'
  // '[1-5]'
  // '1, 0.001'
  // '[1-5], 0.001'
  // ]

  const recipientsData = links.reduce<TAsset[]>((memo, item: string) => {
    const itemSplit = item.split(',')
      .map((item: string) => item.trim())
      .filter(item => item)
    let assets: TAsset[] = []
    if (itemSplit.length === 1) { //['1'] + ['[1-5]']
      assets = parseSingleDataERC721(itemSplit[0])
      
    } else if (itemSplit.length === 2) { //['1','0.001'] + ['[1-5]', '0.001']
      assets = parseDoubleDataERC721(item)
    }
    return [
      ...memo,
      ...assets
    ]
  }, [])
  return recipientsData
}

const parseSingleDataERC721: (value: string) => TAsset[] = (value) => {
  let result = []
  if (value.includes('[') && value.includes(']')) {
    const tokenIds = value
      .replace(/\]/i, '')
      .replace(/\[/i, '')
      .split('-')
      .map((item: string) => item.trim())
    
    const {
      prefix,
      suffix,
      limit
    } = getBignumberInterval(tokenIds[0], tokenIds[1])
    console.log({
      prefix,
      suffix,
      limit
    })
    result = Array.from({length: limit + 1}, (_, i) => ({
      id: prefix + (Number(suffix) + i),
      native_tokens_amount: '0',
      original_native_tokens_amount: '0'
    }))
    console.log({ result })
  } else {
    result.push({
      id: String(value),
      native_tokens_amount: '0',
      original_native_tokens_amount: '0'
    })
  }
  return result
}

const parseDoubleDataERC721: (value: string) => TAsset[] = (value) => {
  let result = []
  if (value.includes('[') && value.includes(']')) {
    // '[1-5], 0.001'
    const idAndAmount = value
      .replace(/\]/i, '')
      .replace(/\[/i, '')
      .split(',')
      .map((item: string) => item.trim()) //['1-5', '0.001']

    const [ intervalStart, intervalFinish ] = idAndAmount[0].split('-').map(item => item.trim())
    for (let x = Number(intervalStart); x <= Number(intervalFinish); x++) {        
      result.push({
        id: String(x),
        native_tokens_amount: String(utils.parseUnits(String(idAndAmount[1]), 18)),
        original_native_tokens_amount: String(idAndAmount[1])
      })
    }
  } else {
    const [ tokenId, nativeTokensAmount ] = value.split(',').map(item => item.trim())
    result.push({
      id: String(tokenId),
      native_tokens_amount: String(utils.parseUnits(String(nativeTokensAmount), 18)),
      original_native_tokens_amount: String(nativeTokensAmount)
    })
  }
  return result
}

export default parseERC721AssetsData

import { checkERC721AssetsDataForMint } from './index'
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

  const recipientsFormatValid = checkERC721AssetsDataForMint(data)
  if (!recipientsFormatValid) {
    return null
  }
  // [
  // '1'
  // '[1-5]'
  // '1, 0.001'
  // '[1-5], 0.001'
  // ]

  const itemSplit = data.split(',')
    .map((item: string) => item.trim())
    .filter(item => item)
  if (itemSplit.length === 1) { //['1'] + ['[1-5]']
    return parseSingleDataERC721(itemSplit[0])
  } else if (itemSplit.length === 2) { //['1','0.001'] + ['[1-5]', '0.001']
    return parseDoubleDataERC721(data)
  }
  return []
}

const parseSingleDataERC721: (value: string) => TAsset[] = (value) => {
  if (value === '1') {
    return [
      {
        id: 0,
        native_tokens_amount: '0',
        original_native_tokens_amount: '0'
      }
    ]
  }
  const {
    prefix,
    suffix,
    limit
  } = getBignumberInterval('0', value)
  return Array.from({ length: limit }, (_, i) => ({
    id: prefix + (Number(suffix) + i),
    native_tokens_amount: '0',
    original_native_tokens_amount: '0'
  }))
}

const parseDoubleDataERC721: (value: string) => TAsset[] = (value) => {
  const idAndAmount = value
    .split(',')
    .map((item: string) => item.trim()) //['2', '0.001']
  if (idAndAmount[0] === '1') {
    return [
      {
        id: 0,
        native_tokens_amount: String(utils.parseUnits(String(idAndAmount[1]), 18)),
        original_native_tokens_amount: idAndAmount[1]
      }
    ]
  }
  const {
    prefix,
    suffix,
    limit
  } = getBignumberInterval('0', idAndAmount[0])
  return Array.from({ length: limit }, (_, i) => ({
    id: prefix + (Number(suffix) + i),
    native_tokens_amount: String(utils.parseUnits(String(idAndAmount[1]), 18)),
    original_native_tokens_amount: idAndAmount[1]
  }))
}

export default parseERC721AssetsData

import { getBignumberInterval } from 'helpers'

const checkERC721Value: (value: string) => boolean = (value) => {
  const itemDivided = value.split(',')
        .map((item: string) => item.trim())
        .filter(item => item)

  if (itemDivided.length === 1) {
    // ['1']
    // ['[1-5]']
    return checkERC721SingleValue(itemDivided[0])
  }

  if (itemDivided.length === 2) {
    return itemDivided.every(checkERC721SingleValue)
  }

  // ['1, 0.001']
  // ['[1-5], 0.001']
  return false
}

const checkERC721SingleValue = (value: string): boolean => {
  if (value === '0') { return false }
  if (isNaN(Number(value))) { return false }
  const {
    diff
  } = getBignumberInterval('0', value)
  return !diff.includes('-')
}

const checkERC721AssetsData = (data: string): boolean => {
  let isValid = false
  if (!data) { return isValid }
  isValid = checkERC721Value(data)
  return isValid
}

export default checkERC721AssetsData
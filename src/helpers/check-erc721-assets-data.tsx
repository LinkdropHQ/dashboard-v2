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
    if (itemDivided[1].includes('[')) { return false }
    return itemDivided.every(checkERC721SingleValue)
  }

  // ['1, 0.001']
  // ['[1-5], 0.001']
  return false
}

const checkERC721SingleValue = (value: string): boolean => {
  console.log({ value })
  if (value.includes('[') && value.includes(']')) {
    const tokenIds = value
      .replace(/\]/i, '')
      .replace(/\[/i, '')
      .split('-')
      .map((item: string) => item.trim())
      .filter(item => item)

    if (tokenIds.length < 2) { return false }
    const {
      diff
    } = getBignumberInterval(tokenIds[0], tokenIds[1])
    console.log({ diff })
    return tokenIds
      .every(item => item === '0' || Boolean(Number(item))) &&
      tokenIds.length === 2 &&
      !diff.includes('-')

  } else {
    if (value === '') { return false }
    return !isNaN(Number(value)) // ['0.001']
  }
}

const checkERC721AssetsData = (data: string): boolean => {
  let isValid = false
  if (!data) { return isValid }
  const links = data.split('\n')
  if (!links) { return isValid }
  isValid = links.every(checkERC721Value)
  return isValid
}

export default checkERC721AssetsData
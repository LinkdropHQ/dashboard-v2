import axios, { AxiosResponse } from 'axios'
import { TERC20TokenOriginalItem } from 'types'
const polygonTokensList = 'https://api-polygon-tokens.polygon.technology/tokenlists/polygonTokens.tokenlist.json'
const mainnetTokensList = 'https://tokens.coingecko.com/uniswap/all.json'

type TGetTokenERC20List = (chainId: number) => Promise<AxiosResponse<{tokens: TERC20TokenOriginalItem[]}>>
const getTokenERC20List: TGetTokenERC20List = (chainId) => {
  const listUrl = chainId === 1 ? mainnetTokensList : polygonTokensList
  return axios.get(listUrl)
}

export default getTokenERC20List

import { getTokenERC20List } from 'data/api'
import { TERC20TokenList } from 'types'

const prepareERC20Url = async (
  chainId: number
) => {
  const { data } = await getTokenERC20List(chainId)
  if (data) {
    const { tokens } = data
    if (tokens) {
      const tokensConverted = tokens.reduce<TERC20TokenList>((res, item) => ({ ...res, [item.address.toLowerCase()]: {
        symbol: item.symbol,
        decimals: item.decimals,
        address: item.address,
        image: {
          thumbnailUrl: item.logoURI
        }
      }
    }), {})
      return tokensConverted
    }
    return {}
  }
}
export default prepareERC20Url
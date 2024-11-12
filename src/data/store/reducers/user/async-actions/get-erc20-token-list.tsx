import { prepareERC20Url, alertError } from 'helpers'

const getERC20TokenList = async (
  chainId: number
) => {
  try {
    const tokens = await prepareERC20Url(chainId)
    console.log({ tokens })
    if (tokens) {
      return tokens
    }
  } catch (err) {
    alertError('Check console for more information')
    console.log({
      err
    })
  } 
}

export default getERC20TokenList
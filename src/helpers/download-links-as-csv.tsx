// import { convertArrayToCSV } from 'convert-array-to-csv'
// const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
// const provider = new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
// const { links, id } = payload
// const linksData = links.map((link, idx) => {
//   const { linkKey } = getHashVariables({ url: link })
//   const linkWallet = new ethers.Wallet(linkKey, provider)
//   const linkId = linkWallet.address
//   return {
//     id: linkId,
//     link
//   }
// })
// yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
// const csv = convertArrayToCSV(linksData)
// const hiddenElement = document.createElement('a')
// hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
// hiddenElement.target = '_blank'
// hiddenElement.download = `links-${id}.csv`
// document.body.appendChild(hiddenElement)
// hiddenElement.click()
// hiddenElement.closest('body').removeChild(hiddenElement)

// export {}

import { TLinkDecrypted } from "types"

const downloadLinksAsCSV = (
  arr: TLinkDecrypted[],
  title: string,
  createdAt?: string
) => {
  const header = Object.keys(arr[0]).join(",")
  const values = arr.map(item => {
    return Object.values(item).join(",")
  })
  const data = [header, ...values].join("\n")
  const hiddenElement = document.createElement('a')
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data)
  hiddenElement.target = '_blank'
  hiddenElement.download = `${title}${createdAt ? `-${createdAt}` : ''}.csv`
  document.body.appendChild(hiddenElement)
  hiddenElement.click()
  const body = hiddenElement.closest('body')
  if (!body) { return }
  body.removeChild(hiddenElement)
}

export default downloadLinksAsCSV

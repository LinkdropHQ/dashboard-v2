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

import { TQRItem } from "types"
import { decrypt } from 'lib/crypto'
const {
  REACT_APP_CLAIM_APP
} = process.env

const downloadQRsAsCSV = (
  arr: TQRItem[],
  title: string,
  dashboardKey: string,
  createdAt?: string
) => {
  const values = arr.map(item => {
    const updatedItem = {
      ar_link: `${REACT_APP_CLAIM_APP}/#/qr/${decrypt(item.encrypted_qr_secret, dashboardKey)}`
    }
    return Object.values(updatedItem).join(",")
  })
  const header = ['qr_link']
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

export default downloadQRsAsCSV
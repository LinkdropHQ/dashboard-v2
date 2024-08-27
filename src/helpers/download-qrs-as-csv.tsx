import { TQRItem } from 'types'
import { decrypt } from 'lib/crypto'
import { defineClaimAppURL } from 'helpers'

const downloadQRsAsCSV = (
  arr: TQRItem[],
  title: string,
  dashboardKey: string,
  userAddress: string,
  createdAt?: string
) => {
  const claimAppURL = defineClaimAppURL(userAddress)
  const values = arr.map(item => {
    const originalLink = `${claimAppURL}/#/qr/${decrypt(item.encrypted_qr_secret, dashboardKey)}`
    const updatedItem = {
      qr_link: originalLink
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
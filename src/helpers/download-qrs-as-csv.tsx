import { TQRItem } from 'types'
import { decrypt } from 'lib/crypto'
import { defineClaimAppURL } from 'helpers'

const downloadQRsAsCSV = (
  arr: TQRItem[],
  title: string,
  dashboardKey: string,
  userAddress: string,
  ssr: boolean,
  createdAt?: string
) => {
  const claimAppURL = defineClaimAppURL(
    userAddress,
    undefined,
    undefined,
    ssr
  )
  const values = arr.map(item => {
    const qrSecret = decrypt(item.encrypted_qr_secret, dashboardKey)
    let originalLink = `${claimAppURL}/#/qr/${qrSecret}`
    if (ssr) {
      originalLink = `${claimAppURL}/qr#${qrSecret}`
    }
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
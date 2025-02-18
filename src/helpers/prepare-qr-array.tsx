import * as wccrypto from '@walletconnect/utils/dist/esm'
import { TQRItem }  from 'types'
import { encrypt } from 'lib/crypto'
import { ethers } from 'ethers5'

const prepareQRArray = (
  quantity: number,
  dashboard_key: string
) => {
  const qrArray: TQRItem[] = []
  for (let i = 0; i < quantity; i++) {
    const newWallet = wccrypto.generateKeyPair()
    const { privateKey } = newWallet
    const qrId = new ethers.Wallet(privateKey).address
    const qr = {
      encrypted_qr_secret: encrypt(privateKey, dashboard_key),
      qr_id: qrId
    }
    qrArray.push(qr)
  }
  return qrArray
}

export default prepareQRArray

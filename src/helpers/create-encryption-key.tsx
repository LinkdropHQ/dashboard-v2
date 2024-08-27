import { utils } from "ethers"

type TCreateEncryptionKey = (
  signerAddress: string,
  campaignNumber: string,
  dashboardKey: string | null
) => string

const createEncryptionKey: TCreateEncryptionKey = (
  dashboardKey,
  signerAddress,
  campaignNumber
) => {
  const result = utils.keccak256(utils.toUtf8Bytes(
    `${dashboardKey}-${signerAddress}-${campaignNumber}`
  ))
  return result.replace('0x', '')
}

export default createEncryptionKey
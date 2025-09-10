import {
  TDispenserStatus,
  TLinkDecrypted,
  TTokenType,
  TClaimPattern,
  TCampaign
} from "types"

export type TProps = {
  pauseDispenser: (dispenser_id: string, callback?: () => void) => any
  unpauseDispenser: (dispenser_id: string, callback?: () => void) => any
  addLinksToDispenser: (
    dispenserId: string,
    links: TLinkDecrypted[],
    encryptedMultiscanQREncCode: string,
    linksCount: number,
    currentStatus: TDispenserStatus,
    callback?: () => void,
  ) => any
  downloadReport: (
    dispenser_id: string,
  ) => any
  dispenserId: string
  dispenserStatus: TDispenserStatus
  loading: boolean
  mappingLoader: number
  encryptedMultiscanQREncCode: string
  linksCount: number


  campaignData: null | TCampaign
}
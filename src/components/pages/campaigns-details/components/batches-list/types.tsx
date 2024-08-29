import { TLinksBatch, TQRManagerItemType } from "types"

export type TCreateDispenserAndAddLinks = (
  title: string,
  dynamic: boolean,
  campaignId: string,
  batchId: string,
  tokenAddress: string,
  wallet: string,
  successCallback?: (
    dispenser_id: string | number,
    dynamic: boolean
  ) => void,
  errorCallback?: () => void,
) => void

export type TCreateQRSetAndAddLinks = (
  title: string,
  campaignId: string,
  batchId: string,
  tokenAddress: string,
  wallet: string,
  successCallback?: (
    dispenser_id: string | number
  ) => void,
  errorCallback?: () => void,
) => void

export type TProps = {
  batches: TLinksBatch[]
  campaignId: string
  title: string
  sdk: boolean
  sponsored: boolean
  wallet: string
  loading: boolean
  createDispenserAndAddLinks: TCreateDispenserAndAddLinks
  createQRSetAndAddLinks: TCreateQRSetAndAddLinks
  downloadLinks: (
    batch_id: string | number,
    campaign_id: string,
    title: string,
    tokenAddress: string | null,
    sponsored: boolean,
    encryptionKey?: string
  ) => void
  encryptionKey: string,
  tokenAddress: string | null,
  linksCreated: number
}
import { BigNumber } from 'ethers'

export type TAsset = {
  amount?: string,
  id?: number | string,
  original_amount?: string
}

export type TTotalAmount = {
  ids?: (number | string)[];
  amount?: BigNumber;
  original_amount?: BigNumber;
}

export type TDefineTotalAmountERC20 = (
  assets: TAsset[],
  decimals?: number | null
) => TTotalAmount

type TAssetsData = TAsset[]

export default TAssetsData
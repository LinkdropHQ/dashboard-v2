import { TDistributionMethod, TLink } from "types"

export type TProps = {
  claimLinks: TLink[]
  distributionMethod: TDistributionMethod | null
}
import { Dispatch } from 'redux'
import { CampaignActions } from '../types'
import { TAssetsData, TLink } from 'types'
import { IAppDispatch } from 'data/store'
import { convertLinksContentERC20V3 } from 'helpers'

function setAssetsData(
  claim_links: TLink[],
  callback?: () => void
) {
  return async (
    dispatch: Dispatch<CampaignActions> & IAppDispatch
  ) => {
    const assets = convertLinksContentERC20V3
    try {
      if (callback) {
        callback()
      }
    } catch (err) {
      console.error({ err })
    }
  }
}

export default setAssetsData

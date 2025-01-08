import { Dispatch } from 'redux'
import * as actionsCampaign from '../actions'
import * as actionsUser from '../../user/actions'
import * as actionsAsyncCampaigns from '../../campaigns/async-actions'
import { CampaignActions } from '../types'
import { UserActions } from '../../user/types'
import { RootState, IAppDispatch } from 'data/store'
import {
  TCampaignLaunch,
  TCampaign
} from 'types'
import { CampaignsActions } from '../../campaigns/types'
import { campaignsApi } from 'data/api'
import { encrypt } from 'lib/crypto'
import {
  sleep,
  createDataGroups,
  createWorkers,
  terminateWorkers,
  getContractVersion,
  alertError
} from 'helpers'
import { Remote } from 'comlink'
import { LinksWorker } from 'web-workers/links-worker'
import { ethers } from 'ethers'
import * as campaignsActions from '../../campaigns/actions'
import * as actionsAsyncUser from '../../user/async-actions'

const launchClaimLinksCampaign = ({
  campaign_id,
  callback
}: {
  campaign_id: string 
  callback?: (id: string) => void,
}) => {
  // @ts-ignore
  return async (
    // @ts-ignore
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions> & IAppDispatch,
    getState: () => RootState
  ) => {
    
    let {
      user: {
        chainId,
        address,
        workersCount,
        signer
      },
      campaign,
      campaigns: { campaigns }
    } = getState()

    const callback = async (
      dashboardKey: string
    ) => {
      let currentPercentage = 0
      try {
        const {
          id,
          assets,
          signerAddress,
          tokenAddress,
          wallet,
          symbol,
          proxyContractAddress,
          tokenStandard,
          claimPattern,
          nativeTokensPerLink,
          links,
          expirationDate,
        } = campaign

        if (!assets) { return alertError('assets are not provided') }
        if (!chainId) { return alertError('assets are not provided') }
        if (!symbol) { return alertError('symbol is not provided') }
        if (!tokenAddress) { return alertError('tokenAddress is not provided') }
        if (!wallet) { return alertError('wallet is not provided') }
        if (!id) { return alertError('campaign id is not provided') }
        if (!signerAddress) { return alertError('signerAddress is not provided') }
        if (!tokenStandard) { return alertError('tokenStandard is not provided') }

        const start = +(new Date())
        const neededWorkersCount = assets.length <= 1000 ? 1 : workersCount

        const updateProgressbar = async (value: number) => {
          if (value === currentPercentage || value < currentPercentage) { return }
          currentPercentage = value
          dispatch(actionsCampaign.setLinksGenerateLoader(currentPercentage))
          await sleep(1)
        }

        const linksGroups = createDataGroups(
          links, neededWorkersCount
        )
        console.log({ linksGroups })
        const workers = await createWorkers(
          linksGroups,
          'links',
          updateProgressbar
        )
        console.log({ workers })

        if (!proxyContractAddress || !chainId) { return }
        const version = await getContractVersion(proxyContractAddress, signer)

        const newLinks = await Promise.all(workers.map(({
          worker,
          data
        }) => (worker as Remote<LinksWorker>).generateLink(
          tokenStandard,
          address,
          Number(chainId),
          data,
          tokenAddress,
          signerKey,
          String(nativeTokensPerLink || '0'),
          dashboardKey,
          proxyContractAddress,
          version,
          expirationDate
        )))

        console.log({ newLinks })
        console.log((+ new Date()) - start)

        if (!tokenStandard || !address) { return }

        const batchLinks= newLinks.flat()

        const newWallet = ethers.Wallet.createRandom()
        const { address: publicKey, privateKey: signerKey } = newWallet

        dispatch(actionsCampaign.setSignerKey(signerKey))
        dispatch(actionsCampaign.setSignerAddress(publicKey))
        
        const campaignData: TCampaignLaunch = {
          encrypted_signer_key: encrypt(signerKey, dashboardKey as string),
          signer_address: signerAddress,
          symbol,
          claim_pattern: claimPattern,
          proxy_contract_version: version,
        }

        const result = await campaignsApi.launchClaimLinks({
          campaign_id,
          campaign: campaignData,
          claim_links: batchLinks
        })
    
        if (result.data.success) {
          const { campaign } = result.data
          if (callback) {
            const campaigns: { data: { campaigns_array: TCampaign[] } } = await campaignsApi.get(chainId)
            dispatch(campaignsActions.updateCampaigns(campaigns.data.campaigns_array))
            callback(campaign.campaign_id)
          }
        }
        terminateWorkers(workers)
        dispatch(actionsCampaign.clearCampaign())
      } catch (err) {
        alertError('Check console for more info')
        console.error('Some error occured', err)
      }
    }


    let dashboardKey = actionsAsyncUser.useDashboardKey(
      getState
    )

    if (!dashboardKey) {
      dispatch(actionsCampaign.setLoading(false))
      dispatch(actionsUser.setDashboardKeyPopup(true))
      dispatch(actionsUser.setDashboardKeyPopupCallback(callback))
      dispatch(actionsCampaign.setLaunchStage('dashboard_key'))
      return 
    } else {
      dispatch(actionsCampaign.setLaunchStage('approve'))
    }
    
    await callback(dashboardKey)
    dispatch(actionsCampaign.setLoading(false))
  
  }
}

export default launchClaimLinksCampaign
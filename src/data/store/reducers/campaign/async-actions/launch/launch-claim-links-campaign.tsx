import { Dispatch } from 'redux'
import * as actionsCampaign from '../../actions'
import { CampaignActions } from '../../types'
import { UserActions } from '../../../user/types'
import { RootState, IAppDispatch } from 'data/store'
import {
  TCampaignLaunch,
  TCampaign,
  TTokenType
} from 'types'
import { CampaignsActions } from '../../../campaigns/types'
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
import * as campaignsActions from '../../../campaigns/actions'

const launchClaimLinksCampaign = async ({
  campaign_id,
  proxyContractAddress,
  token_standard,
  dispatch,
  getState,
  actionCallback,
}: {
  campaign_id: string,
  proxyContractAddress: string,
  token_standard: TTokenType,
  dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions> & IAppDispatch,
  getState: () => RootState,
  actionCallback?: (id: string) => void,
}) => {
    
    let {
      user: {
        chainId,
        address,
        workersCount,
        signer,
        dashboardKey
      },
      campaign,
      campaigns: { campaigns }
    } = getState()

    let currentPercentage = 0
    try {
      const {
        signerAddress,
        tokenAddress,
        symbol,
        claimPattern,
        links,
        signerKey
      } = campaign

      if (!symbol) { return alertError('symbol is not provided') }
      if (!tokenAddress) { return alertError('tokenAddress is not provided') }
      if (!signerAddress) { return alertError('signerAddress is not provided') }

      const start = +(new Date())
      const neededWorkersCount = links.length <= 1000 ? 1 : workersCount

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
        token_standard,
        address,
        Number(chainId),
        data,
        tokenAddress,
        signerKey as string,
        dashboardKey as string,
        proxyContractAddress,
        version
      )))

      console.log({ newLinks })
      console.log((+ new Date()) - start)

      if (!token_standard || !address) { return }

      const batchLinks= newLinks.flat()
      
      const campaignData: TCampaignLaunch = {
        encrypted_signer_key: encrypt(signerKey as string, dashboardKey as string),
        signer_address: signerAddress,
        symbol,
        claim_pattern: claimPattern,
        proxy_contract_version: version
      }

      const result = await campaignsApi.launchClaimLinks({
        campaign_id,
        campaign: campaignData,
        claim_links: batchLinks
      })
  
      if (result.data.success) {
        const { campaign } = result.data
        if (actionCallback) {
          const campaigns: { data: { campaigns_array: TCampaign[] } } = await campaignsApi.get(chainId)
          // @ts-ignore
          dispatch(campaignsActions.updateCampaigns(campaigns.data.campaigns_array))
          actionCallback(campaign.campaign_id)
        }
      }
      terminateWorkers(workers)
      dispatch(actionsCampaign.clearCampaign())
    } catch (err) {
      alertError('Check console for more info')
      console.error('Some error occured', err)
    }
    
    dispatch(actionsCampaign.setLoading(false))
}

export default launchClaimLinksCampaign
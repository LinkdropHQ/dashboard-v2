import { Dispatch } from 'redux';
import * as actionsCampaign from '../actions';
import * as actionsCampaigns from '../../campaigns/actions';
import { CampaignActions } from '../types';
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { TCampaignNew } from 'types'
import { CampaignsActions } from '../../campaigns/types';
import { defineBatchPreviewContents } from 'helpers'
import { campaignsApi } from 'data/api'
import { encrypt } from 'lib/crypto'
import {
  defineNetworkName,
  defineJSONRpcUrl,
  sleep,
  createDataGroups,
  createWorkers,
  terminateWorkers
} from 'helpers'
import { Remote } from 'comlink';
import contracts from 'configs/contracts'
import { LinksWorker } from 'web-workers/links-worker'
const {
  REACT_APP_INFURA_ID,
  REACT_APP_CLAIM_APP,
  REACT_APP_CLAIM_APP_AURORA
} = process.env

const generateERC721Link = ({
  callback,
  id: currentCampaignId
}: { callback?: (id: string) => void, id?: string  }) => {
  return async (
    dispatch: Dispatch<CampaignActions | UserActions | CampaignsActions>,
    getState: () => RootState
  ) => {
    
    let {
      user: {
        chainId,
        address,
        dashboardKey,
        workersCount
      },
      campaign,
      campaigns: { campaigns }
    } = getState()
    let currentPercentage = 0
    try {
      const {
        id,
        assets,
        signerKey,
        tokenAddress,
        wallet,
        symbol,
        title,
        proxyContractAddress,
        sponsored,
        tokenStandard,
        signerAddress,
        claimPattern
      } = campaign
      if (!assets) { return alert('assets are not provided') }
      if (!symbol) { return alert('symbol is not provided') }
      if (!tokenAddress) { return alert('tokenAddress is not provided') }
      if (!wallet) { return alert('wallet is not provided') }
      if (!id) { return alert('campaign id is not provided') }
      if (!chainId) { return alert('chainId is not provided') }
      if (!signerKey) { return alert('signerKey is not provided') }
      if (!signerAddress) { return alert('signerAddress is not provided') }
      if (!dashboardKey || dashboardKey === null) { return alert('dashboardKey is not provided') }
      if (!tokenStandard) { return alert('tokenStandard is not provided') }
      if (!REACT_APP_INFURA_ID) {
        return alert('REACT_APP_INFURA_ID is not provided in .env file')
      }
      if (!REACT_APP_CLAIM_APP_AURORA) {
        return alert('REACT_APP_CLAIM_APP_AURORA is not provided in .env file')
      }
      if (!REACT_APP_CLAIM_APP) {
        return alert('REACT_APP_CLAIM_APP is not provided in .env file')
      }
      const start = +(new Date())
      const neededWorkersCount = assets.length <= 1000 ? 1 : workersCount

      const claimHost = chainId === 1313161554 ? REACT_APP_CLAIM_APP_AURORA : REACT_APP_CLAIM_APP
      const contract = contracts[chainId]
      const networkName = defineNetworkName(chainId)
      const jsonRpcUrl = defineJSONRpcUrl({ chainId, infuraPk: REACT_APP_INFURA_ID })

      const updateProgressbar = async (value: number) => {
        if (value === currentPercentage || value < currentPercentage) { return }
        currentPercentage = value
        dispatch(actionsCampaign.setLinksGenerateLoader(currentPercentage))
        await sleep(1)
      }

      const assetsGroups = createDataGroups(assets, neededWorkersCount)
      console.log({ assetsGroups })
      const workers = await createWorkers(assetsGroups, 'links', updateProgressbar)
      console.log({ workers })

      const newLinks = await Promise.all(workers.map(({
        worker,
        data
      }) => (worker as Remote<LinksWorker>).generateLink(
        tokenStandard,
        address,
        contract.factory,
        networkName,
        jsonRpcUrl,
        `https://${networkName}.linkdrop.io`,
        claimHost,
        data,
        sponsored,
        tokenAddress,
        wallet,
        id,
        signerKey,
        dashboardKey !== null ? dashboardKey : ''
      )))
      console.log({ newLinks })
  
      console.log((+ new Date()) - start)
    
      if (!chainId || !proxyContractAddress || !signerKey || !tokenStandard || !address) { return }
      
      const updatingCampaign = currentCampaignId ? campaigns.find(item => item.campaign_id === currentCampaignId) : undefined
      const batchPreviewContents = defineBatchPreviewContents(
        tokenStandard,
        assets,
        symbol,
        chainId
      )
      
      if (updatingCampaign && currentCampaignId) {
        const result = await campaignsApi.saveBatch(
          currentCampaignId,
          newLinks.flat(),
          sponsored,
          batchPreviewContents
        )

        if (result.data.success) {
          const { campaign_id } = result.data
          if (callback) { callback(campaign_id) }
        }
  
        // dispatch(actionsCampaigns.updateCampaigns(updatedCampaigns))
  
      } else {
        const batch = {
          claim_links: newLinks.flat(),
          sponsored,
          batch_description: batchPreviewContents
        }
        const newCampaign: TCampaignNew = {
          campaign_number: id,
          encrypted_signer_key: encrypt(signerKey, dashboardKey),
          signer_address: signerAddress,
          token_address: tokenAddress,
          creator_address: address,
          wallet,
          symbol,
          title: title || '',
          token_standard: tokenStandard,
          chain_id: chainId,
          proxy_contract_address: proxyContractAddress,
          claim_pattern: claimPattern,
          ...batch
        }

        const result = await campaignsApi.create(newCampaign)
        if (result.data.success) {
          const { campaign } = result.data

          dispatch(actionsCampaigns.addCampaign(campaign))
          if (callback) { callback(campaign.campaign_id) }
        }
        

      }
      terminateWorkers(workers)
      dispatch(actionsCampaign.clearCampaign())
      
    } catch (err) {
      console.error('Some error occured', err)
    }
  }
}

export default generateERC721Link
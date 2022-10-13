import { Dispatch } from 'redux';
import * as actionsCampaign from '../actions';
import * as actionsCampaigns from '../../campaigns/actions';
import { CampaignActions } from '../types';
import { UserActions } from '../../user/types'
import { RootState } from 'data/store'
import { TLink, TCampaignNew, TCampaign } from 'types'
import { EXPIRATION_DATE } from 'configs/app'
import { CampaignsActions } from '../../campaigns/types';
import { defineBatchPreviewContents } from 'helpers'
import { campaignsApi } from 'data/api'
import { encrypt } from 'lib/crypto'
import { sleep } from 'helpers'

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
        sdk,
        chainId,
        address,
        dashboardKey
      },
      campaign,
      campaigns: { campaigns }
    } = getState()
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
      if (!signerKey) { return alert('signerKey is not provided') }
      if (!signerAddress) { return alert('signerAddress is not provided') }
      if (!dashboardKey) { return alert('dashboardKey is not provided') }
      let newLinks: Array<TLink> = []
      const date = String(new Date())
      for (let i = 0; i < assets.length; i++) {
        const result = await sdk?.generateLinkERC721({
          nftAddress: tokenAddress,
          wallet,
          expirationTime: EXPIRATION_DATE,
          campaignId: id,
          signingKeyOrWallet: signerKey,
          tokenId: assets[i].id || 0,
          weiAmount: assets[i].native_tokens_amount || '0'
        })
        if (result) {
          const newLink = !sponsored ? `${result?.url}&manual=true` : result?.url
          const newLinkEncrypted = encrypt(newLink, dashboardKey)
          newLinks = [...newLinks, {
            link_id: result?.linkId,
            encrypted_claim_link: newLinkEncrypted
          }]
          const percentageFinished = Math.round(newLinks.length / assets.length * 100) / 100
          dispatch(actionsCampaign.setLinksGenerateLoader(percentageFinished))
          await sleep(1)
        }
      }
    
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
          newLinks,
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
          claim_links: newLinks,
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
      dispatch(actionsCampaign.clearCampaign())
      
    } catch (err) {
      console.error('Some error occured', err)
    }
  }
}

export default generateERC721Link
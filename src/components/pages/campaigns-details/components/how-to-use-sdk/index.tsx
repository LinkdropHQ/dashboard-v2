import { FC } from 'react'
import { TProps } from './types'
import { Code } from './styled-components'
import {
  WidgetComponent
} from 'components/pages/common'
import { NoteStyled } from '../../styled-components'
import { TextLink } from 'components/common'

const HowToUseSDK: FC<TProps> = ({
  sdk
}) => {
  if (!sdk) { return null }
  return <WidgetComponent
    title='How to use'
  >
    <NoteStyled type='warning'>
      Be careful! Code below includes private data. Do not share publicly. Sharing may lead to loss of assets
    </NoteStyled>
    <NoteStyled>
      To request an API key, please contact us at <TextLink href="mailto:hi@linkdrop.io">hi@linkdrop.io.</TextLink>
    </NoteStyled>
    <Code>
{`// installation: yarn add linkdrop-batch-sdk
// import library
import LinkdropBatchSDK from 'linkdrop-batch-sdk'
// or
// const LinkdropBatchSDK = require('linkdrop-batch-sdk').default

const sdk = new LinkdropBatchSDK({
  // required params
  apiKey: string, // to request an API key, please contact us at hi@linkdrop.io
})

const init = async () => {

  // Get campaign
  const campaign = await sdk.getCampaign(
    campaignId: string,
    signerKey: string, // signer key decrypted with dashboard key
    encryptionKey: string // key for link encryption
  )
  // Get all params from "Campaign parameters" block above

  // Create batch
  const batch = await campaign.createBatch(
    [{ 
      id: string, // Token id (needed for ERC721/ERC1155 campaign)
      amount: string, // Amount of tokens per link (needed for ERC20/ERC1155 campaign)
      links: string, // Amount of links
      weiAmount?: string, // Amount of native tokens. Optional. The default value is '0'.
    }],
    // optional parameters
    {
      batchDescription: string,
      // description of batch. Default: 'Created by SDK'
      shortCodeLength: number,
      // length of short code (default: 12)
      shortCodeMixRegister: boolean
      // should short code be in mixed register (default: true)
    }
  )

  // Get all batches of campaign
  const batches = await campaign.getBatches()

  // Get batch by id
  const batch = await campaign.getBatch(
    batchId: string // id of batch
  )

  // Add links to batch
  const links = await batch.addLinks([{ 
    id: string, // Token id (needed for ERC721/ERC1155 campaign)
    amount: string, // Amount of tokens per link (needed for ERC20/ERC1155 campaign)
    links: string, // Amount of links
    weiAmount?: string, // Amount of native tokens. Optional. The default value is '0'.
  }], {
    shortCodeLength: number,
    // length of short code (default: 12)
    shortCodeMixRegister: boolean
    // should short code be in mixed register (default: true)
  }) 
}

init()

`}
    </Code>

  </WidgetComponent>
}

export default HowToUseSDK
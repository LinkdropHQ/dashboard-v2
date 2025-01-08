import { FC } from 'react'
import {
  ButtonStyled,
  BatchListValueFixed,
  BatchListLabelTextAlignRight,
  Buttons,
  DraftsListStyled
} from '../../styled-components'
import {
  BatchListLabel,
  BatchListValue
} from 'components/pages/common'
import { TProps } from './types'
import {
  TCampaignCreateStep,
  TTokenType
} from 'types'
import { TextLink } from 'components/common'
import {
  formatDate,
  shortenString,
  defineExplorerUrl
} from 'helpers'
import Icons from 'icons'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

const defineDraftUrl = (
  createStep: TCampaignCreateStep,
  tokenStandard: TTokenType
) => {
  switch (createStep) {
    case 'approve':
      return `/campaigns/new/${tokenStandard}/approve`
    case 'secure':
      return `/campaigns/new/${tokenStandard}/secure`
    case 'initial':
      return `/campaigns/new/${tokenStandard}/initial`
    default:
      return `/campaigns/new`
  }
}

const Drafts: FC<TProps> = ({
  drafts
}) => {
  const history = useHistory()

  return drafts && drafts.length > 0 ? <DraftsListStyled>
    <BatchListLabel>Created</BatchListLabel>
    <BatchListLabel>Name</BatchListLabel>
    <BatchListLabel>Token</BatchListLabel>
    <BatchListLabelTextAlignRight>Actions</BatchListLabelTextAlignRight>
    {drafts.map(campaign => {

      const scanUrl = defineExplorerUrl(Number(campaign.chain_id), `/address/${campaign.token_address}`)

      const dateCreatedFormatted = formatDate(campaign.created_at || '')
      return <>
        <BatchListValue>
          {dateCreatedFormatted}
        </BatchListValue>
        <BatchListValueFixed>{campaign.title}</BatchListValueFixed>
        <BatchListValue>
          <TextLink href={scanUrl as string} target='_blank'>
            {shortenString(campaign.token_address as string)}
          </TextLink>
        </BatchListValue>
        <BatchListValue>
          <Buttons>
            <ButtonStyled
              appearance='additional'
              size='extra-small'
              onClick={() => {
                history.push(`/campaigns/${campaign.campaign_id}/draft`)
              }}
            >
              Continue
            </ButtonStyled>
          </Buttons>
          
        </BatchListValue>
      </>}
    )}
  </DraftsListStyled> : null
}

export default Drafts
import { FC } from 'react'
import {
  TProps
} from './types'
import {
  Aside,
  TableRow,
  TableText,
  TableValue,
  AsideContent,
  TableValueShorten,
  AssetsList,
  AsideDivider
} from 'components/pages/common'
import { Tag, TextLink } from 'components/common'
import {
  defineExplorerUrl,
  shortenString
} from 'helpers'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import {
  ButtonsContainer,
  ButtonStyled
} from '../../styled-components'

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    launchClaimLinks: (
      campaignId: string,
      callback?: (campaign_id: string) => void
    ) => {
      dispatch(
        campaignAsyncActions.launchClaimLinks({
          campaign_id: campaignId,
          callback
        })
      )
    }
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> &
                 TProps

const AsideComponent: FC<ReduxType> = ({
  title,
  campaignId,
  draft,
  token,
  chainId,
  distributionMethod,
  launchClaimLinks
}) => {
  const scannerUrl = defineExplorerUrl(chainId, `/address/${token || ''}`)
  console.log({
    token,
    distributionMethod
  })
  return <Aside
    title="Summary"
    subtitle="Check and confirm details"
  >
    <AsideContent>
      <TableRow>
        <TableText>Title of campaign</TableText>
        <TableValueShorten>{title}</TableValueShorten>
      </TableRow>

      <TableRow>
        <TableText>Status</TableText>
        <TableValue>
          <Tag title='Draft' status='info'  />
        </TableValue>
      </TableRow>

      {token && <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {scannerUrl ? <TextLink href={scannerUrl} target='_blank'>{shortenString(token)}</TextLink> : shortenString(token)}
        </TableValue>
      </TableRow>}

      <TableRow>
        <TableText>Distribution</TableText>
        <TableValue>
          {distributionMethod || '-'}
        </TableValue>
      </TableRow>
      <ButtonsContainer>
        <ButtonStyled
          appearance='action'
          onClick={() => {
            launchClaimLinks(
              campaignId,
              () => {
                alert('created')
              }
            )
          }}

          disabled={!token || !distributionMethod}
        >
          Launch
        </ButtonStyled>
      </ButtonsContainer>
    </AsideContent>
  </Aside>
}

// @ts-ignore
export default connect(
  null,
  mapDispatcherToProps
)(AsideComponent)
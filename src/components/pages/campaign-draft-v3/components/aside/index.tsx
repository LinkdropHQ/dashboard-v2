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
} from 'components/pages/common'
import { Tag, TextLink } from 'components/common'
import {
  defineExplorerUrl,
  shortenString
} from 'helpers'

import { connect } from 'react-redux'
import {
  ButtonsContainer,
  ButtonStyledFullWidth
} from '../../styled-components'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { IAppDispatch } from 'data/store'

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    
  }
}

const defineToken = (
  chainId: number,
  token?: string
) => {
  if (!token) {
    return '-'
  }

  const scannerUrl = defineExplorerUrl(chainId, `/address/${token || ''}`)
  if (!scannerUrl) {
    return shortenString(token)
  }

  return <TextLink href={scannerUrl} target='_blank'>{shortenString(token)}</TextLink>
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> &
                 TProps

const AsideComponent: FC<ReduxType> = ({
  title,
  draft,
  token,
  chainId,
  distributionMethod,
  launch
}) => {
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

      <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {/* @ts-ignore */}
          {defineToken(chainId, token)}
        </TableValue>
      </TableRow>
      <TableRow>
        <TableText>Distribution</TableText>
        <TableValue>
          {distributionMethod || '-'}
        </TableValue>
      </TableRow>
    </AsideContent>
    <ButtonsContainer>
      <ButtonStyledFullWidth
        appearance='action'
        onClick={() => {
          launch()
        }}
      >
        Launch
      </ButtonStyledFullWidth>
    </ButtonsContainer>
  </Aside>
}

// @ts-ignore
export default connect(
  null,
  mapDispatcherToProps
)(AsideComponent)
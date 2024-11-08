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
<<<<<<< HEAD
  ButtonStyledFullWidth
=======
  ButtonStyled
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
} from '../../styled-components'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'
import { Dispatch } from 'redux'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { IAppDispatch } from 'data/store'

const mapDispatcherToProps = (dispatch: IAppDispatch & Dispatch<CampaignActions>) => {
  return {
    
  }
}

<<<<<<< HEAD
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

=======
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
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
<<<<<<< HEAD

=======
  const scannerUrl = defineExplorerUrl(chainId, `/address/${token || ''}`)
  console.log({
    token,
    distributionMethod
  })
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
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

<<<<<<< HEAD
      <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {/* @ts-ignore */}
          {defineToken(chainId, token)}
        </TableValue>
      </TableRow>
=======
      {token && <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {scannerUrl ? <TextLink href={scannerUrl} target='_blank'>{shortenString(token)}</TextLink> : shortenString(token)}
        </TableValue>
      </TableRow>}
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440

      <TableRow>
        <TableText>Distribution</TableText>
        <TableValue>
          {distributionMethod || '-'}
        </TableValue>
      </TableRow>
<<<<<<< HEAD
    </AsideContent>
    <ButtonsContainer>
      <ButtonStyledFullWidth
        appearance='action'
        onClick={() => {
          launch()
        }}
        disabled={!token || !distributionMethod}
      >
        Launch
      </ButtonStyledFullWidth>
    </ButtonsContainer>
=======
      <ButtonsContainer>
        <ButtonStyled
          appearance='action'
          onClick={() => {
            launch()
          }}
          disabled={!token || !distributionMethod}
        >
          Launch
        </ButtonStyled>
      </ButtonsContainer>
    </AsideContent>
>>>>>>> 7abbc53cf4fd95eb7eea0d880d540e4c7a710440
  </Aside>
}

// @ts-ignore
export default connect(
  null,
  mapDispatcherToProps
)(AsideComponent)
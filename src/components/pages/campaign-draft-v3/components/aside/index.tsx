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
import { TextLink } from 'components/common'
import {
  defineExplorerUrl,
  shortenString
} from 'helpers'

const AsideComponent: FC<TProps> = ({
  title,
  draft,
  token,
  chainId,
  distributionMethod
}) => {
  const scannerUrl = defineExplorerUrl(chainId, `/address/${token || ''}`)

  return <Aside
    title="Summary"
    subtitle="Check and confirm details"
  >
    <AsideContent>
      <TableRow>
        <TableText>Title of campaign</TableText>
        <TableValueShorten>{title}</TableValueShorten>
      </TableRow>

      {token && <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {scannerUrl ? <TextLink href={scannerUrl} target='_blank'>{shortenString(token)}</TextLink> : shortenString(token)}
        </TableValue>
      </TableRow>}

      
    </AsideContent>
  </Aside>
}


export default AsideComponent
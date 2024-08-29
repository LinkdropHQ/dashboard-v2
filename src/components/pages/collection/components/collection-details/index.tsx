import { FC } from 'react'
import {
  TableRow,
  TableText,
  TableValue
} from 'components/pages/common'
import {
  AsideStyled,
  AsideContent,
  Divider
} from './styled-components'
import {
  shortenString,
  defineNetworkName,
  defineExplorerUrl
} from 'helpers'
import { TextLink } from 'components/common'
import { TProps } from './types'

const CollectionDetails: FC<TProps> = ({
  symbol,
  tokenType,
  tokenAddress,
  userAddress,
  name,
  chainId
}) => {

  const networkName = defineNetworkName(chainId)
  const scannerUrl = defineExplorerUrl(Number(chainId), `/address/${tokenAddress}`)
  const userScannerAddress = defineExplorerUrl(Number(chainId), `/address/${userAddress}`)

  return <AsideStyled title="Collection details">
    <AsideContent>
      <TableRow>
        <TableText>Owner</TableText>
        <TableValue>
          {userScannerAddress ? <TextLink
            href={userScannerAddress}
            target="_blank"
          >
            {shortenString(userAddress)}
          </TextLink> : shortenString(userAddress)}
        </TableValue>
      </TableRow>
    
      <TableRow>
        <TableText>Address</TableText>
        <TableValue>
          {scannerUrl ? <TextLink
            href={scannerUrl}
            target="_blank"
          >
            {shortenString(tokenAddress)}
          </TextLink> : shortenString(tokenAddress)}
        </TableValue>
      </TableRow>

      <Divider />

      <TableRow>
        <TableText>Collection name</TableText>
        <TableValue>{name}</TableValue>
      </TableRow>

      <TableRow>
        <TableText>Collection symbol</TableText>
        <TableValue>{symbol}</TableValue>
      </TableRow>

      <Divider />

      <TableRow>
        <TableText>Network</TableText>
        <TableValue>{networkName}</TableValue>
      </TableRow>

      <TableRow>
        <TableText>Token standard</TableText>
        <TableValue>{tokenType}</TableValue>
      </TableRow>

      
    </AsideContent>
  </AsideStyled>
}

export default CollectionDetails
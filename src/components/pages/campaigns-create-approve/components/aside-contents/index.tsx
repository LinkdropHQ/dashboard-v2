import { FC } from 'react'
import { TAsideContentsProps } from './types'
import {
  AsideNote,
  ApprovedIcon,
  LoaderStyled
} from './styled-components'
import {
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
  shortenString,
  defineNetworkName,
  defineNativeTokenSymbol
} from 'helpers'
import { TAssetsData, TTokenType, TClaimPattern } from 'types'
import { BigNumber, utils } from 'ethers5'
import { TLinksContent } from '../../types'


const renderTotalLinksSegment = (
  sdk: boolean,
  sponsored: boolean,
  assetsParsed: TAssetsData
) => {
  if (sdk && !sponsored) { return null }
  return <TableRow>
    <TableText>Total links</TableText>
    <TableValue>{assetsParsed.length}</TableValue>
  </TableRow>

}

const renderSecureAmount = (
  sponsored: boolean,
  totalComission: BigNumber,
  nativeTokenSymbol: string
) => {
  if (!sponsored) {
    return null
  }
  return <>
    <AsideDivider />
    <TableRow>
      <TableText>To be secured (sponsorship)</TableText>
      <TableValue>{String(utils.formatUnits(totalComission, 18))} {nativeTokenSymbol}</TableValue>
    </TableRow>
  </>
}

const renderAssetsList = (
  sdk: boolean,
  campaignTokenStandard: TTokenType | null,
  data: TLinksContent,
  claimPattern: TClaimPattern
) => {
  if (sdk || !campaignTokenStandard) { return null }
  return <AssetsList
    claimPattern={claimPattern}
    data={data}
    type={campaignTokenStandard}
  />
}

const renderTotal = (
  totalComission: BigNumber,
  nativeTokenSymbol: string
) => {
  return <TableRow>
    <TableText>Total amount</TableText>
    <TableValue>{String(utils.formatUnits(totalComission, 18))} {nativeTokenSymbol}</TableValue>
  </TableRow>
}

const AsideContents: FC<TAsideContentsProps> = ({
  approved,
  campaignTitle,
  tokenAddress,
  campaignSymbol,
  campaignTokenStandard,
  campaignChainId,
  claimPattern,
  assetsParsed,
  sdk,
  data,
  sponsored,
  totalComission
}) => {
  const scannerUrl = defineExplorerUrl(campaignChainId, `/address/${tokenAddress || ''}`)
  const nativeTokenSymbol = defineNativeTokenSymbol({ chainId: campaignChainId })

  const approvedNote = () => {
    if (approved === null) {
      return <AsideNote>
        <LoaderStyled />
        Сhecking approval...
      </AsideNote>
    }

    if (approved) {
      return <AsideNote>
        <ApprovedIcon />
        Token has been approved before
      </AsideNote>
    }
    return null
  }

  return <>
    <AsideContent>
      <TableRow>
        <TableText>Title of campaign</TableText>
        <TableValueShorten>{campaignTitle}</TableValueShorten>
      </TableRow>

      {tokenAddress && <TableRow>
        <TableText>Token address</TableText>
        <TableValue>
          {scannerUrl ? <TextLink href={scannerUrl} target='_blank'>{shortenString(tokenAddress)}</TextLink> : shortenString(tokenAddress)}
        </TableValue>
      </TableRow>}

      {campaignSymbol && <TableRow>
        <TableText>Token Name</TableText>
        <TableValue>{campaignSymbol}</TableValue>
      </TableRow>}

      {campaignTokenStandard && <TableRow>
        <TableText>Token standard</TableText>
        <TableValue>{campaignTokenStandard}</TableValue>
      </TableRow>}

      {campaignChainId && <TableRow>
        <TableText>Network</TableText>
        <TableValue>{defineNetworkName(Number(campaignChainId))}</TableValue>
      </TableRow>}

      {renderAssetsList(
        sdk,
        campaignTokenStandard,
        data,
        claimPattern
      )}

      {sdk && <AsideDivider />}

      {renderTotalLinksSegment(sdk, sponsored, assetsParsed)}

      <TableRow>
        <TableText>Claim pattern</TableText>
        <TableValue>{claimPattern}</TableValue>
      </TableRow>
      {renderSecureAmount(sponsored, totalComission, nativeTokenSymbol)}

      <AsideDivider />
      {renderTotal(totalComission, nativeTokenSymbol)}

    </AsideContent>
    {approvedNote()}
  </>
}

export default AsideContents


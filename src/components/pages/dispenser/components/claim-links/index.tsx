import { FC, useState } from 'react'
import {
  AsideContent,
  AsideStyled,
  AsideWidgetButton,
} from './styled-components'
import {
  TDispenserStatus,
  TCampaign
} from 'types'
import {
  TableRow,
  TableText,
  TableValue,
  WidgetSubtitle,
  UploadLinksPopup
} from 'components/pages/common'
import {
  TextLink,
  Loader
} from 'components/common'
import Icons from 'icons'
import { TProps } from './types'
import { useHistory } from 'react-router-dom'
import {
  defineNetworkName,
  shortenString,
  defineExplorerUrl
} from 'helpers'

const defineOptions = (
  status: TDispenserStatus,
  editCallback: () => void,
  pauseCallback: () => void,
  unpauseCallback: () => void
) => {
  return [
    {
      title: status === 'PAUSED' ? 'Unpause' : 'Pause',
      icon: status === 'PAUSED' ? <Icons.UnpauseIcon /> : <Icons.PauseIcon />,
      action: status === 'PAUSED' ? unpauseCallback : pauseCallback
    },
  ]
}

const defineButton = (
  dispenserStatus: TDispenserStatus,
  dispenserId: string,
  toggleUpdateLinksPopup: (open: boolean) => void,
  downloadReport: (dispenser_id: string,) => Promise<void>
) => {
  if (dispenserStatus === 'NOT_UPLOADED') {
    return <AsideWidgetButton
      title='Upload file with Links'
      appearance='action'
      onClick={() => {
        toggleUpdateLinksPopup(true)
      }}
    />
  }

  return <AsideWidgetButton
    title='Download Report'
    onClick={() => {
      downloadReport(dispenserId)
    }}
  />
}

const defineContent = (
  dispenserStatus: TDispenserStatus,
  campaignData: null | TCampaign,
  loading: boolean
) => {

  if (loading) {
    return <Loader size='large' />
  }

  if (dispenserStatus === 'NOT_UPLOADED') {
    return <WidgetSubtitle>
      Upload a CSV file with claim links in the required format. If you haven’t created claim links yet, then do it in <TextLink to='/campaigns'>Claim links</TextLink>.
    </WidgetSubtitle>
  }
  if (!campaignData) { return null }
  const chainId = Number(campaignData.chain_id)
  const networkName = defineNetworkName(chainId)
  const explorerUrl = defineExplorerUrl(chainId, `/token/${campaignData.token_address}`)
  const explorerLink = <TextLink href={explorerUrl as string} target='_blank'>
    {shortenString(campaignData.token_address)}
  </TextLink>
  return <>
    <TableRow>
      <TableText>Token</TableText>
      <TableValue>
        {explorerLink}
      </TableValue>
    </TableRow>

    <TableRow>
      <TableText>Network</TableText>
      <TableValue>{networkName}</TableValue>
    </TableRow>

    <TableRow>
      <TableText>Token standard</TableText>
      <TableValue>{campaignData.token_standard}</TableValue>
    </TableRow>

    {campaignData.token_id && <TableRow>
      <TableText>Token ID</TableText>
      <TableValue>{campaignData.token_id}</TableValue>
    </TableRow>}

    <TableRow>
      <TableText>Claim pattern</TableText>
      <TableValue>{campaignData.claim_pattern === 'mint' ? 'mint' : 'transfer'}</TableValue>
    </TableRow>

    <TableRow>
      <TableText>Sponsorship</TableText>
      <TableValue>{campaignData.sponsored ? 'Enabled' : 'Disabled'}</TableValue>
    </TableRow>
  </>
  
}

const ClaimLinks: FC<TProps> = ({
  pauseDispenser,
  unpauseDispenser,
  dispenserId,
  dispenserStatus,
  loading,
  mappingLoader,
  encryptedMultiscanQREncCode,
  linksCount,
  addLinksToDispenser,
  downloadReport,
  campaignData

}) => {
  const dispenserOptions = defineOptions(
    dispenserStatus,
    () => history.push(`/dispensers/edit/${dispenserId}`),
    () => pauseDispenser(dispenserId, () => {}),
    () => unpauseDispenser(dispenserId, () => {})
  )
  const history = useHistory()

  const [
    updateLinksPopup,
    toggleUpdateLinksPopup
  ] = useState<boolean>(false)

  const button = defineButton(
    dispenserStatus,
    dispenserId,
    toggleUpdateLinksPopup,
    downloadReport
  )

  const content = defineContent(
    dispenserStatus,
    campaignData,
    loading
  )

  return <AsideStyled
    title="Claim links"
    options={dispenserOptions}
  >
    <AsideContent loading={loading}>
      {updateLinksPopup && <UploadLinksPopup
        loader={mappingLoader}
        loading={loading}
        onClose={() => toggleUpdateLinksPopup(false)}
        onSubmit={links => {
          if (!dispenserId) { return alert('Dispenser ID not found') }
          if (!encryptedMultiscanQREncCode) { return alert('encrypted_multiscan_qr_enc_code not found') }
          if (linksCount === undefined) { return alert('links_count not found') }
          if (!links) { return alert('Links not found') }
          addLinksToDispenser(dispenserId, links, encryptedMultiscanQREncCode, linksCount, dispenserStatus, () => {
            toggleUpdateLinksPopup(false)
          })
        }}
      />}
      {content}
    </AsideContent>
    {button}
  </AsideStyled>
}

export default ClaimLinks

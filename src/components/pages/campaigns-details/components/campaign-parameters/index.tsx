import { FC, useEffect, useState } from 'react'
import { TProps } from './types'
import contracts from 'configs/contracts'
import {
  TableRow,
  TableText,
  TableValue,
  WidgetComponent
} from 'components/pages/common'
import { NoteStyled } from '../../styled-components'
import { SecretString } from 'linkdrop-ui'
import { decrypt } from 'lib/crypto'

const CampaignParameters: FC<TProps> = ({
  masterAddress,
  campaignId,
  encryptionKey,
  encryptedSignerKey,
  chainId,
  sdk
}) => {
  if (!sdk) { return null }
  const contract = contracts[chainId]

  const [ signingKey, setSigningKey ] = useState('FIX NEEDED')

  useEffect(() => {
    // const init = async () => {

    //   decrypt(encryptedSignerKey, dashboardKey)

    // }
  }, [])
  
  return <WidgetComponent
    title='Campaign parameters'
  >
    <NoteStyled type='warning'>
      Be careful! This information is private. Do not share publicly. Sharing may lead to loss of assets
    </NoteStyled>
    <TableRow>
      <TableText>Master address</TableText>
      <TableValue>{masterAddress}</TableValue>
    </TableRow>
    {contract && <TableRow>
      <TableText>Factory address</TableText>
      <TableValue>{contract.factory}</TableValue>
    </TableRow>}
    <TableRow>
      <TableText>Signing key</TableText>
      <TableValue><SecretString text={signingKey} ableToCopy /></TableValue>
    </TableRow>
    <TableRow>
      <TableText>Encryption key</TableText>
      <TableValue><SecretString text={encryptionKey} ableToCopy /></TableValue>
    </TableRow>
    <TableRow>
      <TableText>Campaign ID</TableText>
      <TableValue>{campaignId}</TableValue>
    </TableRow>
  </WidgetComponent>
}

export default CampaignParameters
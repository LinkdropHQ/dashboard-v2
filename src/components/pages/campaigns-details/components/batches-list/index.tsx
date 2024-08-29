import { FC, useState } from 'react'
import {
  TProps,
  TCreateDispenserAndAddLinks,
  TCreateQRSetAndAddLinks
} from './types'
import {
  BatchList,
  BatchListLabel,
  BatchListValue,
  Container,
  NewDispenserPopup
} from 'components/pages/common'
import {
  formatTime,
  formatDate,
  copyToClipboard,
  shortenString
} from 'helpers'
import {
  WidgetButton,
  SecondaryTextSpan
} from '../../styled-components'
import {
  ClipboardCopy,
  BatchId,
  LoaderStyled,
  Buttons
} from './styled-components'
import Icons from 'icons'
import { useHistory } from 'react-router-dom'

const defineDispenserTypes = (
  createDispenserAndAddLinks: TCreateDispenserAndAddLinks,
  createQRSetAndAddLinks: TCreateQRSetAndAddLinks,
  campaignId: string,
  batchId: string,
  tokenAddress: string,
  wallet: string,
  campaignTitle: string,

  successCallbackForDispenser?: (
    dispenser_id: string | number,
    dynamic: boolean
  ) => void,

  successCallbackForQRSet?: (
    dispenser_id: string | number
  ) => void,

  errorCallback?: () => void,
) => {
  return [
    {
      title: 'Dynamic QR for electronic displays',
      text: 'A web page with an auto-refresh QR code that updates in real time. This ensures secure distribution, preventing a single user from claiming all tokens',
      onClick: () => {
        createDispenserAndAddLinks(
          `Dispenser for ${campaignTitle}`,
          true,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          successCallbackForDispenser,
          errorCallback
        )
      },
      image: <Icons.DynamicQRPreviewIcon />
    }, {
      title: 'Printable Dispenser QR code',
      text: 'A single QR code that dispenses tokens one-by-one to users after they scan it. Ideal for controlled and sequential token distribution',
      onClick: () => {
        createDispenserAndAddLinks(
          `Dispenser for ${campaignTitle}`,
          false,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          successCallbackForDispenser,
          errorCallback
        )
      },
      image: <Icons.DispenserQRPreviewIcon />
    }, {
      title: 'Printable Set of QR codes',
      text: 'A set of single-claim QR codes. Each QR code is valid for one claim only, and becomes invalid after being scanned and claimed by a user',
      onClick: () => {
        createQRSetAndAddLinks(
          `QR set for ${campaignTitle}`,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          successCallbackForQRSet
        )
      },
      image: <Icons.QRSetPreviewIcon />
    }
  ]
}

const BatchIdContainer: FC<{batchId: string}> = ({ batchId }) => {
  const [ copied, setCopied ] = useState<boolean>(false)
  return <BatchId onClick={() => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
    copyToClipboard({ value: batchId })
  }}>
    {shortenString(batchId)}
    <ClipboardCopy>
      {copied ? <Icons.ClipboardCopiedIcon /> : <Icons.ClipboardCopyIcon /> }
    </ClipboardCopy>
  </BatchId>
}

const BatchesList: FC<TProps> = ({
  batches,
  campaignId,
  title,
  sdk,
  loading,
  downloadLinks,
  tokenAddress,
  encryptionKey,
  sponsored,
  linksCreated,
  wallet,
  createDispenserAndAddLinks,
  createQRSetAndAddLinks
}) => {


  const history = useHistory()

  if (linksCreated === 0) {
    return <span>No links have been created yet.</span>
  }

  const [
    showPopup,
    setShowPopup
  ] = useState<boolean | string>(false)

  const dispenserOptions = defineDispenserTypes(
    createDispenserAndAddLinks,
    createQRSetAndAddLinks,
    campaignId,
    String(showPopup),
    tokenAddress as string,
    wallet,
    title,

    // for dispenser
    (
      dispenser_id: string | number,
      dynamic: boolean
    ) => {
        setShowPopup(false)
        if (dynamic) {
          return history.push(`/dynamic-qrs/${dispenser_id}`)
        }
        return history.push(`/dispensers/${dispenser_id}`)
      },
    // for qr-set
    (
      dispenser_id: string | number
    ) => {
        setShowPopup(false)
        return history.push(`/qrs/${dispenser_id}`)
      },
    () => {
        setShowPopup(false)
      },
  )

  return <>
    {showPopup && <NewDispenserPopup
      dispenserOptions={dispenserOptions}
      title='Create QR campaign'
      subtitle='Start new QR campaign to distribute your tokens by choosing the method that best suits your needs:'
      onClose={() => {
        setShowPopup(false)
      }}
    />}
  
    <Container>
      {loading ? <LoaderStyled /> : <BatchList>
        <BatchListLabel>#</BatchListLabel>
        <BatchListLabel>Batch ID</BatchListLabel>
        
        <BatchListLabel>Created at</BatchListLabel>
        <BatchListLabel>Links</BatchListLabel>
        <BatchListLabel></BatchListLabel>
        {batches && batches.map((batch, idx) => {
          const dateFormatted = formatDate(batch.created_at || '')
          const timeFormatted = formatTime(batch.created_at || '')
          return <>
            <BatchListValue>
              {idx + 1}
            </BatchListValue>
            <BatchListValue>
              <BatchIdContainer batchId={batch.batch_id} />
            </BatchListValue>

            <BatchListValue>
              {dateFormatted} <SecondaryTextSpan>{timeFormatted}</SecondaryTextSpan>
            </BatchListValue>
            <BatchListValue>
              {batch.claim_links_count}
            </BatchListValue>
            <Buttons>
              <WidgetButton
                appearance='action'
                disabled={batch.claim_links_count === 0}
                size='extra-small'
                title='Download'
                onClick={() => {
                  downloadLinks(
                    batch.batch_id,
                    campaignId,
                    title,
                    tokenAddress,
                    Boolean(sponsored),
                    sdk ? encryptionKey : undefined
                  )
                }}
              />

              {false && <WidgetButton
                appearance='additional'
                disabled={batch.claim_links_count === 0}
                size='extra-small'
                title='Distribute'
                onClick={() => {
                  setShowPopup(batch.batch_id)
                }}
              />}
            </Buttons>
            
          </>
        })}
      </BatchList>}
      
    </Container>
  </>
}

export default BatchesList
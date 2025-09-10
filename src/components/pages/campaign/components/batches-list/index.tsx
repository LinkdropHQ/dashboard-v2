import { FC, useState } from 'react'
import {
  TProps,
  TCreateDispenserAndAddLinks,
  TCreateQRSetAndAddLinks,
  TCreateReclaimAndAddLinks
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
  SecondaryTextSpan
} from '../../styled-components'
import {
  ClipboardCopy,
  BatchId,
  LoaderStyled,
  Buttons,
  ButtonStyled,
  ButtonIcon
} from './styled-components'
import Icons from 'icons'
import { useHistory } from 'react-router-dom'
import { TLinksBatch, TTokenType } from 'types'

const defineDispenserTypes = (
  createDispenserAndAddLinks: TCreateDispenserAndAddLinks,
  createQRSetAndAddLinks: TCreateQRSetAndAddLinks,
  createReclaimAndAddLinks: TCreateReclaimAndAddLinks,
  campaignId: string,
  batchId: string,
  tokenAddress: string,
  wallet: string,
  tokenType: TTokenType,
  customClaimHost: string,
  customClaimHostOn: boolean,
  campaignTitle: string,

  dispenserMappingPageRedirect: () => void,
  qrSetMappingPageRedirect: () => void,
  reclaimMappingPageRedirect: () => void,

  successCallbackForDispenser?: (
    dispenser_id: string | number,
    dynamic: boolean
  ) => void,

  successCallbackForQRSet?: (
    dispenser_id: string | number
  ) => void,

  successCallbackForReclaim?: (
    dispenser_id: string | number
  ) => void,

  errorCallback?: () => void,
) => {
  return [
    // {
    //   title: 'Web2 Retrodrop',
    //   text: 'Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol. Learn more at https://www.reclaimprotocol.org/',
    //   onClick: () => {
    //     createReclaimAndAddLinks(
    //       reclaimMappingPageRedirect,
    //       `Reclaim set for ${campaignTitle}`,
    //       campaignId,
    //       batchId,
    //       tokenAddress,
    //       wallet,
    //       tokenType,
    //       customClaimHost,
    //       customClaimHostOn,
    //       successCallbackForReclaim
    //     )
    //   },
    //   image: <Icons.DispenserQRPreviewIcon />
    // },
    {
      title: 'Dynamic QR for electronic displays',
      text: 'A web page with an auto-refresh QR code that updates in real time. This ensures secure distribution, preventing a single user from claiming all tokens',
      onClick: () => {
        createDispenserAndAddLinks(
          dispenserMappingPageRedirect,
          `Dispenser for ${campaignTitle}`,
          true,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          tokenType,
          customClaimHost,
          customClaimHostOn,
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
          dispenserMappingPageRedirect,
          `Dispenser for ${campaignTitle}`,
          false,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          tokenType,
          customClaimHost,
          customClaimHostOn,
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
          qrSetMappingPageRedirect,
          `QR set for ${campaignTitle}`,
          campaignId,
          batchId,
          tokenAddress,
          wallet,
          tokenType,
          customClaimHost,
          customClaimHostOn,
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

const defineDistributeButton = (
  batch: TLinksBatch,
  setShowPopup: (batchId: string) => void
) => {
  if (batch.qr_campaign) {
    if (batch.qr_campaign_type === 'QR_SET') {
      return <ButtonStyled
        appearance='additional'
        size='extra-small'
        title='QR Set'
        to={`/qrs/${batch.qr_campaign}`}
      />
    }

    if (batch.qr_campaign_type === 'DISPENSER') {
      return <ButtonStyled
        appearance='additional'
        size='extra-small'
        title='Dispenser'
        to={`/dispensers/${batch.qr_campaign}`}
      />
    }

    if (batch.qr_campaign_type === 'RECLAIM') {
      return <ButtonStyled
        appearance='additional'
        size='extra-small'
        title='Reclaim'
        to={`/reclaims/${batch.qr_campaign}`}
      />
    }

    if (batch.qr_campaign_type === 'DYNAMIC_DISPENSER') {
      return <ButtonStyled
        appearance='additional'
        size='extra-small'
        title='Dynamic'
        to={`/dynamic-qrs/${batch.qr_campaign}`}
      />
    }
  }
  return <ButtonStyled
    appearance='action'
    disabled={batch.claim_links_count === 0}
    size='extra-small'
    title='Distribute'
    onClick={() => {
      setShowPopup(batch.batch_id)
    }}
  />
}

const BatchesList: FC<TProps> = ({
  batches,
  campaignId,
  title,
  sdk,
  loading,
  downloadLinks,
  customClaimHost,
  customClaimHostOn,
  tokenAddress,
  encryptionKey,
  sponsored,
  linksCreated,
  wallet,
  tokenType,
  createDispenserAndAddLinks,
  createQRSetAndAddLinks,
  createReclaimAndAddLinks
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
    createReclaimAndAddLinks,
    campaignId,
    String(showPopup),
    tokenAddress as string,
    wallet,
    tokenType,
    customClaimHost,
    customClaimHostOn,
    title,

    () => {
      history.push(`/campaigns/${campaignId}/dispenser/generate`)
    },

    () => {
      history.push(`/campaigns/${campaignId}/qrs/generate`)
    },

    () => {
      history.push(`/campaigns/${campaignId}/dispenser/generate`)
    },

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
    (
      reclaim_id: string | number
    ) => {
      setShowPopup(false)
      return history.push(`/reclaims/${reclaim_id}?settings_open=reclaim`)
    },
    () => {
      setShowPopup(false)
      return history.push(`/campaigns/${campaignId}`)
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
        <BatchListLabel>Distribution</BatchListLabel>
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
              <ButtonStyled
                appearance='additional'
                disabled={batch.claim_links_count === 0}
                size='extra-small'
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
              >
                <ButtonIcon>
                  <Icons.DownloadFileIcon />
                </ButtonIcon>
                CSV
              </ButtonStyled>

              {defineDistributeButton(
                batch,
                setShowPopup
              )}
            </Buttons>
            
          </>
        })}
      </BatchList>}
      
    </Container>
  </>
}

export default BatchesList
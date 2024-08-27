import { FC, useState, useMemo, useEffect } from 'react'
import { RootState, IAppDispatch } from 'data/store'
import {
  Container,
  WidgetSubtitle,
  DownloadQRPopup
} from 'components/pages/common'
import {
  Buttons,
  WidgetButton,
  WidgetComponentStyled,
  CopyContainerStyled,
  Text,
  QRImage,
  MainContent,
  Overlay
} from './styled-components'
import {
  Statistics,
  Status,
  Settings,
  ClaimLinks,
  QRCode
} from './components'
import QRCodePreview from 'images/QR-code-preview.png'
import DynamicQRImageSrc from 'images/dynamic-qr.png'
import {
  defineDispenserStatus
} from 'helpers'
import { Redirect, useParams } from 'react-router-dom'
import {
  TDispenser,
  TDispenserStatus,
  TLinkDecrypted,
  TDispenserWhitelistType
} from 'types'
import { Loader } from 'components/common'
import { connect } from 'react-redux'
import * as asyncDispensersActions from 'data/store/reducers/dispensers/async-actions'
import * as dispensersActions from 'data/store/reducers/dispensers/actions'

const mapStateToProps = ({
  campaigns: { campaigns },
  dispensers: {
    dispensers,
    loading,
    mappingLoader,
    currentDispenserData
  },
  user: { address, chainId, dashboardKey },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  dispensers,
  loading,
  dashboardKey,
  mappingLoader,
  currentDispenserData
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    
    addLinksToDispenser: (
      itemId: string,
      links: TLinkDecrypted[],
      encryptedMultiscanQREncCode: string,
      linksCount: number,
      currentStatus: TDispenserStatus,
      successCallback?: () => void,

    // @ts-ignore
    ) => dispatch(asyncDispensersActions.addLinksToDispenser({
      itemId,
      links,
      encryptedMultiscanQREncCode,
      linksCount,
      currentStatus,
      successCallback
    })),
    downloadQR: (
      size: number,
      multiscan_qr_id: string,
      encrypted_multiscan_qr_secret: string,
      encrypted_multiscan_qr_enc_code: string,
      qrDispenserName: string,
      whitelistOn: boolean,
      dynamic: boolean,
      successCallback?: () => void
    ) => dispatch(asyncDispensersActions.downloadDispenserQR({
      multiscan_qr_id,
      encrypted_multiscan_qr_secret,
      encrypted_multiscan_qr_enc_code,
      qrDispenserName,
      width: size,
      height: size,
      whitelist_on: whitelistOn,
      dynamic,
      successCallback
    })),
    
    getDispenserData: (
      multiscan_qr_id: string
    ) => dispatch(asyncDispensersActions.getDispenserData({
      multiscan_qr_id
    })),

    removeCurrentDispenserData: () => dispatch(dispensersActions.setCurrentDispenserData({
      campaign: null
    })),
  
    pauseDispenser: (
      dispenser_id: string,
      callback?: () => void
    ) => dispatch(asyncDispensersActions.updateStatus({
      dispenser_id,
      active: false,
      callback
    })),
  
    unpauseDispenser: (
      dispenser_id: string,
      callback?: () => void
    ) => dispatch(asyncDispensersActions.updateStatus({
      dispenser_id,
      active: true,
      callback
    })),
  
    toggleRedirectURL: (
      dispenser_id: string,
      redirect_on: boolean,
      successCallback: () => void,
      errorCallback: () => void
    ) => dispatch(asyncDispensersActions.toggleRedirectOn({
      dispenser_id,
      redirect_on,
      successCallback,
      errorCallback
    })),

    toggleTimeframe: (
      dispenser_id: string,
      timeframe_on: boolean,
      successCallback: () => void,
      errorCallback: () => void
    ) => dispatch(asyncDispensersActions.toggleTimeframeOn({
      dispenser_id,
      timeframe_on,
      successCallback,
      errorCallback
    })),

    updateRedirectURL: (
      dispenser_id: string,
      redirect_url: string,
      encrypted_multiscan_qr_enc_code: string,
      successCallback?: () => void,
      errorCallback?: () => void
    ) => dispatch(asyncDispensersActions.updateRedirectURL({
      dispenser_id,
      redirect_url,
      encrypted_multiscan_qr_enc_code,
      successCallback,
      errorCallback
    })),

    toggleWhitelist: (
      dispenser_id: string,
      whitelist_on: boolean,
      successCallback: () => void,
      errorCallback: () => void
    ) => dispatch(asyncDispensersActions.toggleWhitelistOn({
      dispenser_id,
      whitelist_on,
      successCallback,
      errorCallback
    })),

    downloadReport: (
      dispenser_id: string,
    ) => dispatch(asyncDispensersActions.downloadReport(
      dispenser_id
    )),

    createAddressWhitelist: (
      dispenserId: string,
      whitelist: string[],
      whitelistType: TDispenserWhitelistType,
      successCallback?: () => void,
      errorCallback?: () => void
    ) => dispatch(asyncDispensersActions.createWhitelist({
      dispenser_id: dispenserId,
      whitelist,
      whitelist_type: whitelistType,
      successCallback,
      errorCallback
    })),

    updateAddressWhitelist: (
      dispenserId: string,
      whitelist: string[],
      whitelistType: TDispenserWhitelistType,
      successCallback?: () => void,
      errorCallback?: () => void
      // @ts-ignore
    ) => dispatch(asyncDispensersActions.updateWhitelist({
      dispenser_id: dispenserId,
      whitelist,
      whitelist_type: whitelistType,
      successCallback,
      errorCallback
    })),

    getDispenserWhitelist: (
      dispenser_id: string,
      callback?: () => void
    ) => dispatch(asyncDispensersActions.getDispenserWhitelist({
      dispenser_id,
      callback
    })),

    updateDispenser: (
      dispenser_id: string,
      startDate: string,
      finishDate: string,
      // duration: number,
      callback?: () => void
    ) => dispatch(asyncDispensersActions.updateDispenserDate({
      dispenserId: dispenser_id,
      startDate,
      finishDate,
      // duration,
      callback
    })),

    decryptDispenserData: (
      dispenser_id: string
    ) => {
      dispatch(asyncDispensersActions.decryptDispenserData(
        { dispenser_id }
      ))
    }
  }
}

const defineTitle = (
  dynamic: boolean
) => {
  return dynamic ? 'Dynamic QR code web page' : 'Dispenser web page'
}

const defineSubtitle = (
  dynamic: boolean
) => {
  return dynamic ? 
    'Linkdrop Dispenser QR is represented by a single QR code that dispenses tokens one-by-one to users after they scan it' :
    'Linkdrop Dynamic QR is represented by a single QR code that updates in real time, preventing a single user from claiming all tokens'
}


const renderMainButton = (
  dynamic: boolean,
  toggleDownloadPopup: (downloadPopup: boolean) => void,
  decryptDispenserData: () => void,
  dispenser_url?: string,
  dashboardKey?: string | null
) => {

  if (!dashboardKey) {
    return <WidgetButton
      title='Show QR code'
      appearance='action'
      onClick={decryptDispenserData}
    /> 
  }
  const title = !dynamic ? 'Download PNG' : 'Launch Dynamic QR App'
  return <WidgetButton
    title={title}
    onClick={() => {
      if (!dynamic) {
        toggleDownloadPopup(true)
        return
      }
    console.log({ dispenser_url })
      if (dispenser_url) {
        window.open(dispenser_url, '_blank')
        return 
      }

      alert('Redirect URL not defined')

    }}
  /> 
}

const defineQRItem = (
  dynamic: boolean,
  address: string,
  dispenser_url?: string,
  dashboard_key?: string | null
) => {
  console.log({ 
    dashboard_key,
    dynamic,
    dispenser_url
  })
  if (!dashboard_key) {
    return <QRImage src={QRCodePreview} />
  }

  if (dynamic) {
    return <QRImage src={DynamicQRImageSrc} />
  }

  if (dispenser_url) {
    return <QRCode link={dispenser_url} address={address} />
  }
}

const defineQRCodeDescription = () => {
  return <Text>
    Tokens you are dispensing can be claimed by anyone who goes to Campaign Website or scans Campaigns QR code
  </Text>
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const Dispenser: FC<ReduxType> = ({
  dispensers,
  loading,
  mappingLoader,
  addLinksToDispenser,
  dashboardKey,
  address,
  downloadQR,
  pauseDispenser,
  unpauseDispenser,
  createAddressWhitelist,
  updateRedirectURL,
  toggleRedirectURL,
  toggleTimeframe,
  getDispenserData,
  downloadReport,
  toggleWhitelist,
  updateAddressWhitelist,
  currentDispenserData,
  removeCurrentDispenserData,
  updateDispenser,
  getDispenserWhitelist,
  decryptDispenserData
}) => {
  const { id } = useParams<{id: string}>()
  // @ts-ignore
  const dispenser: TDispenser | undefined = dispensers.find(dispenser => String(dispenser.dispenser_id) === id)


  const [
    downloadPopup,
    toggleDownloadPopup
  ] = useState<boolean>(false)


  if (!dispenser) {
    return <Redirect to='/dispensers' />
  }

  useEffect(() => {
    if (
      !dispenser ||
      !dispenser?.updated_at ||
      dispenser?.links_count === 0
    ) { return }
    console.log('getDispenserData')

    getDispenserData(
      dispenser.multiscan_qr_id as string
    )

    return () => {
      removeCurrentDispenserData()
    }
  }, [dispenser?.updated_at])

  useEffect(() => {
    if (!dashboardKey) { return }
    console.log('decrypting')
    decryptDispenserData(id)
  }, [
    dashboardKey,
    dispenser?.whitelist_on,
    dispenser?.redirect_on
  ])

  const qrCodeDescription = defineQRCodeDescription()

  console.log({ dispenser })

  const {
    dispenser_id,
    redirect_url,
    active,
    redirect_on,
    claim_duration,
    claim_start,
    links_count,
    encrypted_multiscan_qr_enc_code,
    encrypted_multiscan_qr_secret,
    multiscan_qr_id,
    title,
    links_claimed,
    links_assigned,
    whitelist_on,
    dynamic,
    claim_finish,
    timeframe_on,
    dispenser_url,
    decrypted_redirect_url
  } = dispenser

  const currentStatus = defineDispenserStatus(
    claim_start as number,
    claim_finish || claim_start as number + (claim_duration || 1000000000000),
    links_count || 0,
    active,
    redirect_on,
    redirect_url,
    timeframe_on
  )

  const mainButton = renderMainButton(
    dynamic as boolean,
    toggleDownloadPopup,
    () => decryptDispenserData(id),
    dispenser_url,
    dashboardKey
  )

  const qrCodeContainer = defineQRItem(
    Boolean(dynamic),
    address,
    dispenser_url,
    dashboardKey
  )

  return <Container>
    {id && downloadPopup && <DownloadQRPopup
      onSubmit={(size: number) => {
        downloadQR(
          size,
          multiscan_qr_id,
          encrypted_multiscan_qr_secret,
          encrypted_multiscan_qr_enc_code,
          title,
          Boolean(whitelist_on),
          Boolean(dynamic),
          () => { toggleDownloadPopup(false) }
        )
      }}
      onClose={() => toggleDownloadPopup(false)}
    />}

    <MainContent>
      {loading && <Overlay>
        <Loader />  
      </Overlay>}
      <WidgetComponentStyled title={defineTitle(Boolean(dynamic))}>
        <WidgetSubtitle>
          {defineSubtitle(Boolean(dynamic))}
        </WidgetSubtitle>
        
        {qrCodeContainer}

        {qrCodeDescription}

        {dispenser_url && <CopyContainerStyled
          text={dispenser_url}
        />}
        
        <Buttons>
          {mainButton}
        </Buttons>
      </WidgetComponentStyled>
    </MainContent>


    <div>
      <Status
        status={currentStatus}
        dateStart={claim_start}
        dateFinish={claim_finish}
        timeframeOn={timeframe_on}
      />
      <Statistics
        linksCount={links_count || 0}
        dispenserStatus={currentStatus}
        linksAssigned={links_assigned || 0}
        linksClaimed={links_claimed || 0}
        downloadReport={() => downloadReport(dispenser_id as string)}
      />

      <ClaimLinks
        pauseDispenser={pauseDispenser}
        unpauseDispenser={unpauseDispenser}
        downloadReport={downloadReport}
        dispenserId={dispenser_id as string}
        dispenserStatus={currentStatus}
        loading={loading}
        mappingLoader={mappingLoader}
        encryptedMultiscanQREncCode={encrypted_multiscan_qr_enc_code}
        linksCount={links_count || 0}
        addLinksToDispenser={addLinksToDispenser}
        // not available
        campaignData={currentDispenserData.campaign}
      />


      <Settings
        redirectUrl={decrypted_redirect_url}
        claimUrl={dispenser_url}
        loading={loading}
        campaignData={currentDispenserData.campaign}
        getDispenserWhitelist={getDispenserWhitelist}
        currentDispenser={dispenser}
        whitelistToggleValue={whitelist_on}

        whitelistToggleAction={(
          whitelistOn
        ) => {
          toggleWhitelist (
            dispenser_id as string,
            whitelistOn,
            () => {
              
            },
            () => alert('error')
          )
        }}



        whitelistSubmit={(
          whitelistAdresses,
          onSuccess
        ) => {
          if (whitelist_on) {
            return updateAddressWhitelist(
              dispenser_id as string,
              whitelistAdresses,
              'address',
              onSuccess,
              () => alert('error')
            )
          }
          

          createAddressWhitelist(
            dispenser_id as string,
            whitelistAdresses,
            'address',
            onSuccess,
            () => alert('error')
          )
          
        }}

        redirectToggleAction={(
          redirectOn
        ) => {
          toggleRedirectURL(
            dispenser_id as string,
            redirectOn,
            () => {
              
            },
            () => alert('error'),
          )
        }}
        redirectToggleValue={redirect_on}
        redirectSubmit={(
          newRedirectUrl,
          onSuccess
        ) => {
          updateRedirectURL(
            dispenser_id as string,
            newRedirectUrl,
            encrypted_multiscan_qr_enc_code,
            onSuccess,
            () => alert('error')
          )
        }}

        timeframeToggleValue={timeframe_on}

        timeframeToggleAction={(timeframeOn) => toggleTimeframe(
          dispenser_id as string,
          timeframeOn,
          () => {},
          () => alert('error'),
        )}

        timeframeSubmit={(
          startTime,
          finishTime,
          onSuccess,
          OnError
        ) => {
          updateDispenser(
            dispenser_id as string,
            startTime,
            finishTime,
            onSuccess,
          )
        }}
      />
    </div>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(Dispenser)
import {
  useState,
  FC,
  useEffect
} from 'react'
import { RootState, IAppDispatch } from 'data/store'
import {
  Container,
  WidgetSubtitle,
} from 'components/pages/common'
import {
  WidgetButton,
  WidgetComponentStyled,
  CopyContainerStyled,
  Text,
  MainContent,
  Overlay
} from './styled-components'
import {
  Statistics,
  Status,
  Settings,
  ClaimLinks
} from './components'
import {
  TSettingItem
} from './types'
import {
  defineDispenserStatus
} from 'helpers'
import { Redirect, useParams } from 'react-router-dom'
import {
  TDispenser,
  TDispenserStatus,
  TLinkDecrypted
} from 'types'
import { Loader, TextLink } from 'components/common'
import { connect } from 'react-redux'
import * as asyncDispensersActions from 'data/store/reducers/dispensers/async-actions'
import * as dispensersActions from 'data/store/reducers/dispensers/actions'
import { useQuery } from 'hooks'

const settings = [
  {
    title: 'Timeframe',
    subtitle: 'You can set up the link expiration, so that users will not be able to claim after a certain day and time, or select \'No End Date\' to allow ongoing claims',
    id: 'timeframe',
    tooltip: 'Set an expiration date and time for the link, so users cannot claim tokens after it expires'
  }, {
    title: 'Reclaim Settings',
    id: 'reclaim',
    subtitle: 'Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol. Learn more at https://www.reclaimprotocol.org/',
    tooltip: 'Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol.'
  }
]

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
      reclaim: boolean,
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
      reclaim,
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

    downloadReport: (
      dispenser_id: string,
    ) => dispatch(asyncDispensersActions.downloadReport(
      dispenser_id
    )),

    updateDispenser: (
      dispenser_id: string,
      startDate: string,
      finishDate: string,
      callback?: () => void
    ) => dispatch(asyncDispensersActions.updateDispenserDate({
      dispenserId: dispenser_id,
      startDate,
      finishDate,
      callback
    })),

    decryptDispenserData: (
      dispenser_id: string
    ) => {
      dispatch(asyncDispensersActions.decryptDispenserData(
        { dispenser_id }
      ))
    },

    reclaimSubmit: (
      dispenserId: string,
      reclaimAppId: string,
      reclaimAppSecret: string,
      reclaimProviderId: string,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      dispatch(
        asyncDispensersActions.updateReclaim({
          dispenserId,
          reclaimAppId,
          reclaimAppSecret,
          reclaimProviderId,
          successCallback: onSuccess,
          errorCallback: onError
        }) 
      )
    }
  }
}

const defineTitle = () => {
  return 'Reclaim Give-away'
}

const defineSubtitle = (
) => {
  return <Text>
    Share tokens with any regular website users (Twitter/Github/Reddit/your website). Powered by Reclaim Protocol. Learn more at <TextLink href='https://www.reclaimprotocol.org/' target='_blank'>https://www.reclaimprotocol.org/</TextLink>
  </Text>
}


const renderMainButton = (
  decryptDispenserData: () => void,
  openReclaimSettings: () => void,
  reclaimAppId?: string | null,
  reclaimAppSecret?: string | null,
  reclaimProviderId?: string | null,
  reclaimUrl?: string,
  dashboardKey?: string | null
) => {
  if (!reclaimAppId || !reclaimAppSecret || !reclaimProviderId) {
    return <WidgetButton
      title='Configure Reclaim Settings'
      appearance='action'
      onClick={openReclaimSettings}
    /> 
  }

  if (!dashboardKey) {
    return <WidgetButton
      title='Show Drop URL'
      appearance='action'
      onClick={decryptDispenserData}
    /> 
  }

  return <WidgetButton
    title='Launch Reclaim App'
    onClick={() => {
      if (reclaimUrl) {
        window.open(reclaimUrl, '_blank')
        return 
      }

      alert('Redirect URL not defined')

    }}
  /> 
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const ReclaimQR: FC<ReduxType> = ({
  dispensers,
  loading,
  mappingLoader,
  addLinksToDispenser,
  dashboardKey,
  pauseDispenser,
  unpauseDispenser,
  toggleTimeframe,
  getDispenserData,
  downloadReport,
  currentDispenserData,
  removeCurrentDispenserData,
  updateDispenser,
  decryptDispenserData,
  reclaimSubmit
}) => {

  const currentPageQuery = useQuery()
  const initialSettingFromQuery = currentPageQuery.get('settings_open')
  const initialSetting = initialSettingFromQuery ? (settings.find(setting => setting.id === initialSettingFromQuery) || null): null

  const [
    currentSetting,
    setCurrentSetting
  ] = useState<null | TSettingItem>(initialSetting)

  const { id } = useParams<{id: string}>()
  // @ts-ignore
  const dispenser: TDispenser | undefined = dispensers.find(dispenser => String(dispenser.dispenser_id) === id)

  if (!dispenser) {
    return <Redirect to='/dispensers' />
  }

  useEffect(() => {
    if (
      !dispenser ||
      !dispenser?.updated_at ||
      dispenser?.links_count === 0
    ) { return }

    getDispenserData(
      dispenser.multiscan_qr_id as string
    )

    return () => {
      removeCurrentDispenserData()
    }
  }, [
    dispenser?.updated_at
  ])

  useEffect(() => {
    if (!dashboardKey) { return }
    decryptDispenserData(id)
  }, [
    dashboardKey,
    dispenser?.whitelist_on,
    dispenser?.redirect_on,
    dispenser?.reclaim
  ])


  const {
    dispenser_id,
    redirect_url,
    active,
    redirect_on,
    claim_duration,
    claim_start,
    links_count,
    encrypted_multiscan_qr_enc_code,
    links_claimed,
    links_assigned,
    claim_finish,
    timeframe_on,
    dispenser_url,
    reclaim_app_id,
    reclaim_app_secret,
    reclaim_provider_id
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


  return <Container>

    <MainContent>
      {loading && <Overlay>
        <Loader />  
      </Overlay>}
      <WidgetComponentStyled title={defineTitle()}>
        <WidgetSubtitle>
          {defineSubtitle()}
        </WidgetSubtitle>
        
        {dispenser_url && reclaim_app_id && reclaim_app_secret && reclaim_provider_id && <CopyContainerStyled
          title='Reclaim Drop URL'
          text={dispenser_url}
        />}

        {renderMainButton(
          () => decryptDispenserData(id),
          () => setCurrentSetting(settings.find(setting => setting.id === 'reclaim') || null),
          reclaim_app_id,
          reclaim_app_secret,
          reclaim_provider_id,
          dispenser_url,
          dashboardKey
        )}

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
        loading={loading}
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
        reclaimAppId={reclaim_app_id}
        settings={settings}
        reclaimAppSecret={reclaim_app_secret}
        reclaimProviderId={reclaim_provider_id}
        campaignData={currentDispenserData.campaign}
        currentDispenser={dispenser}
        reclaimSubmit={
          (
            reclaimAppId,
            reclaimAppSecret,
            reclaimProviderId,
            onSuccess,
            onError
          ) => {
            reclaimSubmit(
              dispenser_id as string,
              reclaimAppId,
              reclaimAppSecret,
              reclaimProviderId,
              onSuccess,
              onError
            )
          }
        }

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
export default connect(mapStateToProps, mapDispatcherToProps)(ReclaimQR)
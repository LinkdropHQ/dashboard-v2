import { FC, useEffect } from 'react'
import {
  LaunchPopup,
  LaunchPopupItem
} from 'components/pages/common'
import { TProps, TDefineStatus } from './types'
import { RootState, IAppDispatch } from 'data/store'
import { CampaignActions } from 'data/store/reducers/campaign/types'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions/index'

const mapStateToProps = ({
  campaign: {
    launchStage
  }
}: RootState) => ({
  launchStage
})

const defineStatus: TDefineStatus = (
  actualStatus,
  stage
) => {
  if (actualStatus === 'dashboard_key') {
    switch (stage) {
      case 'dashboard_key':
        return 'current'
      default:
        return 'disabled'
    }
  }

  if (actualStatus === 'approve') {
    switch (stage) {
      case 'dashboard_key':
        return 'done'
      case 'approve':
        return 'current'
      default:
        return 'disabled'
    }
  }

  if (actualStatus === 'secure') {
    switch (stage) {
      case 'approve':
      case 'dashboard_key':
        return 'done'
      case 'secure':
        return 'current'
      default:
        return 'disabled'
    }
  }

  return 'disabled'
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapDispatcherToProps> & ReturnType<typeof mapStateToProps> & TProps

const LaunchProcessPopup: FC<ReduxType> = ({
  title,
  text,
  onClose,
  launchStage,
}) => {

  return <LaunchPopup
    title={title}
    text={text}
    onClose={onClose}
  >
    <LaunchPopupItem
      title='Generating sign key'
      status={defineStatus(
        launchStage,
        'dashboard_key'
      )}
    />
    <LaunchPopupItem
      title='Approve'
      status={defineStatus(
        launchStage,
        'approve'
      )}
    />
    <LaunchPopupItem
      title='Secure'
      status={defineStatus(
        launchStage,
        'secure'
      )}
    />
  </LaunchPopup>
}

// @ts-ignore
export default connect(
  mapStateToProps
)(LaunchProcessPopup)
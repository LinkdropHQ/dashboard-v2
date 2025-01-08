import { FC } from 'react'
import {
  LaunchPopup,
  LaunchPopupItem
} from 'components/pages/common'
import { TProps } from './types'
import { TLaunchStage } from 'types'
import { Dispatch } from 'redux'
import { RootState, IAppDispatch } from 'data/store'

import { connect } from 'react-redux'

const mapStateToProps = ({
  campaign: {
    launchStage
  }
}: RootState) => ({
  launchStage
})

const LaunchProcessPopup: FC<TProps> = ({
  title,
  text,
  onClose
}) => {
  return <LaunchPopup
    title={title}
    text={text}
    onClose={onClose}
  >
    <LaunchPopupItem title='Generating sign key' />
    <LaunchPopupItem title='Approve' />
    <LaunchPopupItem title='Secure' />
  </LaunchPopup>
}

// @ts-ignore
export default connect(
  mapStateToProps
)(LaunchProcessPopup)
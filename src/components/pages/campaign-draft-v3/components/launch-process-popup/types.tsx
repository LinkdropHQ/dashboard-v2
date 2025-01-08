import { TLaunchStepStatus } from 'components/pages/common/launch-popup/types'
import { TLaunchStage } from 'types'

export type TProps = {
  title: string
  text: string
  onClose: () => void
  campaignId: string
}


export type TDefineStatus = (
  actualStatus: TLaunchStage,
  stage: TLaunchStage
) => TLaunchStepStatus
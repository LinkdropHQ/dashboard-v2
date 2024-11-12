import { FC } from 'react'
import {
  Container,
  GenerateProgressBar,
  GenerateTitle,
  GenerateSubtitle,
  GenerateProgress
} from './styled-components'
import { RootState } from 'data/store'
import { connect } from 'react-redux'

const mapStateToProps = ({
  qrs: {
    mappingLoader,
    uploadLoader
  }
}: RootState) => ({
  mappingLoader,
  uploadLoader
})

type ReduxType = ReturnType<typeof mapStateToProps>

const CampaignQRsGenerate: FC<ReduxType> = ({
  mappingLoader,
  uploadLoader
}) => {

  return <Container>
    <GenerateProgress>
      {Math.ceil(mappingLoader * 100)}%
    </GenerateProgress>

    <GenerateTitle>
      QRs uploading
    </GenerateTitle>
    <GenerateSubtitle>
      Don’t close this window until all QRs are successfully created
    </GenerateSubtitle>
    
    <GenerateProgressBar
      max={100}
      current={Math.ceil(uploadLoader * 100)}
    />

    <GenerateProgressBar
      max={100}
      current={Math.ceil(mappingLoader * 100)}
    />
  </Container>
}

export default connect(mapStateToProps)(CampaignQRsGenerate)

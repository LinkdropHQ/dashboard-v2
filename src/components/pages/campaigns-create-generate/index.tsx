import { FC, useEffect } from 'react'
import {
  Container,
  GenerateProgressBar,
  GenerateTitle,
  GenerateSubtitle,
  GenerateProgress
} from './styled-components'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import * as campaignAsyncActions from 'data/store/reducers/campaign/async-actions'
import { useHistory } from 'react-router-dom'
import { TRouterURLParams } from 'types'
import { useParams } from 'react-router-dom'
import { TCallback } from './types'
import { preventPageClose } from 'helpers'

const mapStateToProps = ({
  campaign: {
    tokenStandard,
    links,
    linksGenerateLoader,
    sdk
  },
}: RootState) => ({
  tokenStandard,
  links,
  linksGenerateLoader,
  sdk
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    generateLinks: (callback: TCallback, id?: string, ) => dispatch(campaignAsyncActions.generateLinks({
      callback,
      id
    }))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatcherToProps>

const CampaignsCreateGenerate: FC<ReduxType> = ({
  generateLinks,
  sdk,
  linksGenerateLoader,
  tokenStandard
}) => {
  const history = useHistory()
  const { id } = useParams<TRouterURLParams>()

  useEffect(() => {
    if (!tokenStandard) { return }
    generateLinks((id) => {
      history.push(`/campaigns/${id}`)
    }, id)
  }, [])

  useEffect(preventPageClose(), [])

  if (sdk) {
    return null
  }

  return <Container>
    <GenerateProgress>
      {Math.ceil(linksGenerateLoader * 100)}%
    </GenerateProgress>

    <GenerateTitle>
      Links generating
    </GenerateTitle>
    <GenerateSubtitle>
      Don’t close this window until all links are successfully created
    </GenerateSubtitle>
    
    <GenerateProgressBar
      max={100}
      current={Math.ceil(linksGenerateLoader * 100)}
    />
  </Container>
}

export default connect(mapStateToProps, mapDispatcherToProps)(CampaignsCreateGenerate)

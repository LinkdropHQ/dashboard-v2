import { FC, useState, useRef } from 'react'
import {
  Container,
  InputComponent,
  Buttons,
  ContainerButton
} from './styled-components'
import {
  WidgetComponent,
  WidgetSubtitle
} from 'components/pages/common'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import * as asyncDispensersActions from 'data/store/reducers/dispensers/async-actions'
import { useHistory } from 'react-router-dom'

const mapStateToProps = ({
  campaigns: { campaigns },
  dispensers: { loading, dispensers },
  user: { address, chainId },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  loading,
  dispensers
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    createDispenser: (
      title: string,
      dynamic: boolean,
      reclaimAppId: string,
      reclaimSecret: string,
      reclaimProviderId: string,
      successCallback: (id: string | number) => void
    ) => dispatch(asyncDispensersActions.createDispenser({
      title,
      dynamic,
      reclaim: true,
      reclaim_app_id: reclaimAppId,
      reclaim_app_secret: reclaimSecret,
      reclaim_provider_id: reclaimProviderId,
      successCallback
    }))
  }
}


// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const ReclaimQRCreate: FC<ReduxType> = ({
  createDispenser,
  loading,
  dispensers 
}) => {
  const history = useHistory()
  // @ts-ignore
  
  const [ title, setTitle ] = useState<string>('')
  const [ reclaimAppId, setReclaimAppId ] = useState<string>('')
  const [ reclaimSecret, setReclaimSecret ] = useState<string>('')
  const [ reclaimProviderId, setReclaimProviderId ] = useState<string>('')

  return <Container>
    <WidgetComponent title='New reclaim QR'>
      <WidgetSubtitle>Reclaim app is represented by a single link or QR code that you can share for multiple users to scan to claim a unique token. Scanning is limited within a certain timeframe</WidgetSubtitle>
      <InputComponent
        title='Title'
        placeholder='My first reclaim app...'
        value={title}
        onChange={(value: string) => { setTitle(value); return value }}
      />
      <InputComponent
        title='Reclaim App ID'
        placeholder='App ID'
        value={reclaimAppId}
        onChange={(value: string) => { setReclaimAppId(value); return value }}
      />
      <InputComponent
        title='Reclaim Secret'
        placeholder='Reclaim Secret'
        value={reclaimSecret}
        onChange={(value: string) => { setReclaimSecret(value); return value }}
      />
      <InputComponent
        title='Reclaim Provider ID'
        placeholder='Reclaim Provider ID'
        value={reclaimProviderId}
        onChange={(value: string) => { setReclaimProviderId(value); return value }}
      />

      <Buttons>
        <ContainerButton
          to='/reclaims'
        >
          Back
        </ContainerButton>
        <ContainerButton
          disabled={!title || !reclaimAppId || !reclaimSecret || !reclaimProviderId}
          appearance='action'

          loading={loading}
          onClick={() => {

              createDispenser(
                title,
                false, // NOT dynamic
                reclaimAppId,
                reclaimSecret,
                reclaimProviderId,
                (id) => history.push(`/reclaims/${id}`)
              )
          }}
        >
          Create
        </ContainerButton>
      </Buttons>
      
    </WidgetComponent>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(ReclaimQRCreate)

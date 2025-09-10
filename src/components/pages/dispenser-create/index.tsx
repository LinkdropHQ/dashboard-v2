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
import { useParams } from 'react-router-dom'
import { TLinkParams } from './types'
import { TDispenser } from 'types'

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
      successCallback: (id: string | number) => void
    ) => dispatch(asyncDispensersActions.createDispenser({
      title,
      dynamic,
      reclaim: false,
      reclaim_app_id: undefined,
      reclaim_app_secret: undefined,
      reclaim_provider_id: undefined,
      successCallback
    }))
  }
}


// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const DispenserCreate: FC<ReduxType> = ({
  createDispenser,
  loading,
  dispensers 
}) => {
  const { dispenserId } = useParams<TLinkParams>()
  const history = useHistory()
  // @ts-ignore
  const currentDispenser: TDispenser | null | undefined = dispenserId ? dispensers.find(item => item.dispenser_id === dispenserId) : null
  const dispenserTitle = currentDispenser ? currentDispenser.title : ''
  
  const [ title, setTitle ] = useState<string>(dispenserTitle)

  return <Container>
    <WidgetComponent title='New dispenser'>
      <WidgetSubtitle>Dispenser app is represented by a single link or QR code that you can share for multiple users to scan to claim a unique token. Scanning is limited within a certain timeframe</WidgetSubtitle>
      <InputComponent
        title='Title'
        placeholder='My first dispenser app...'
        value={title}
        onChange={(value: string) => { setTitle(value); return value }}
      />

      <Buttons>
        <ContainerButton
          to={currentDispenser ? `/dispensers/${currentDispenser.dispenser_id}` : '/dispensers'}
        >
          Back
        </ContainerButton>
        <ContainerButton
          disabled={!title}
          appearance='action'
          loading={loading}
          onClick={() => {
              createDispenser(
                title,
                false, // NOT dynamic
                (id) => history.push(`/dispensers/${id}`)
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
export default connect(mapStateToProps, mapDispatcherToProps)(DispenserCreate)

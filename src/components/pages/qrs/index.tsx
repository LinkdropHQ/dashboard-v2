import { FC, useState } from 'react'
import { Popup, Loader } from 'components/common'
import { useHistory } from 'react-router-dom'
import {
  QRItem,
  Container,
  ContainerButton,
  InputComponent
} from './styled-components'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import * as asyncQRsActions from 'data/store/reducers/qrs/async-actions.tsx'

const mapStateToProps = ({
  campaigns: { campaigns },
  qrs: { qrs, loading },
  user: { address, chainId },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  qrs,
  loading
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    addQRSet: (
      title: string,
      quantity: number,
      callback: (id: string | number) => void
    ) => dispatch(asyncQRsActions.addQRSet({ title, quantity, callback }))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const QRs: FC<ReduxType> = ({
  chainId,
  address,
  addQRSet,
  qrs,
  loading
}) => {
  const history = useHistory()
  const [ popup, showPopup ] = useState<boolean>(false)
  const [ title, setTitle ] = useState<string>('')
  const [ amount, setAmount ] = useState<string>('')
  const togglePopup = (state: boolean) : void => showPopup(state)

  const defineIfPopupDisabled = () => {
    return loading || !title || !amount || !Number(amount) || isNaN(Number(amount)) || Number(amount) % 1 !== 0
  }

  return <Container>
    {loading && <Loader withOverlay />}
    {popup && <Popup
      title='Add new set of QR codes'
      onClose={() => togglePopup(false)}
    >
      <InputComponent
        value={title}
        title='Name of the set'
        onChange={value => { setTitle(value); return value }}
      />
      <InputComponent
        value={amount}
        title='Quantity of QR codes'
        onChange={value => { setAmount(value); return value }}
      />
      <ContainerButton
        title='Create'
        appearance='action'
        disabled={defineIfPopupDisabled()}
        onClick={() => {
          if(isNaN(Number(amount))) { return alert('Amount is not valid') }
          addQRSet(
            title,
            Number(amount),
            (id) => {
              togglePopup(false)
            }
          )
        }}
      />
    </Popup>}
    <ContainerButton
      title='Add QRs'
      appearance='action'
      onClick={() => togglePopup(true)}
    />
    {qrs.map(qr => {
      return <QRItem
        {...qr}
        key={qr.set_id}
        onManage={() => {
          history.push(`/qrs/${qr.set_id}`)
        }}
      />
    })}
    
  </Container>
}

export default connect(mapStateToProps, mapDispatcherToProps)(QRs)

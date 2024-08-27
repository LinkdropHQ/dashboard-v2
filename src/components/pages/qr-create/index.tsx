import { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Container,
  InputComponent,
  ContainerButton,
  Buttons
} from './styled-components'

import {
  WidgetComponent
} from 'components/pages/common'
import { alertError } from 'helpers'
import { RootState, IAppDispatch } from 'data/store'
import { connect } from 'react-redux'
import * as asyncQRsActions from 'data/store/reducers/qrs/async-actions.tsx'
const { REACT_APP_STARTER_PLAN_LINKS_LIMIT, REACT_APP_PRO_PLAN_LINKS_LIMIT } = process.env

const mapStateToProps = ({
  campaigns: { campaigns },
  qrs: { qrs, loading, uploadLoader },
  user: { address, chainId, whitelisted },
}: RootState) => ({
  campaigns,
  address,
  chainId,
  qrs,
  uploadLoader,
  loading,
  whitelisted
})

const mapDispatcherToProps = (dispatch: IAppDispatch) => {
  return {
    addQRSet: (
      title: string,
      quantity: number,
      successCallback: (id: string | number) => void
    ) => dispatch(asyncQRsActions.addQRSet({ title, quantity, successCallback }))
  }
}

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const QRCreate: FC<ReduxType> = ({
  addQRSet,
  qrs,
  loading,
  uploadLoader,
  whitelisted
}) => {
  const history = useHistory()
  const [ title, setTitle ] = useState<string>('')
  const [ amount, setAmount ] = useState<string>('')
  const limit = Number(whitelisted ? REACT_APP_PRO_PLAN_LINKS_LIMIT : REACT_APP_STARTER_PLAN_LINKS_LIMIT)

  return <Container>
    <WidgetComponent title='New QR set'>
      <InputComponent
        value={title}
        disabled={loading}
        title='Name of the set'
        onChange={value => { setTitle(value); return value }}
      />
      <InputComponent
        value={amount}
        disabled={loading}
        title='Quantity'
        note='You can change quantity later'
        onChange={value => {
          if (/^[0-9]+$/.test(value) || value === '') {
            setAmount(value);
          }
          return value
        }}
      />
      <Buttons>
        <ContainerButton
          title='Back'
          appearance='default'
          to='/qrs'
        />
        <ContainerButton
          title={loading ? `Creating ${Math.ceil(uploadLoader * 100)}%` : 'Create'}
          appearance='action'
          loading={loading}
          disabled={!title || !amount || loading}
          onClick={() => {
            if(isNaN(Number(amount))) { return alertError('Amount is not valid') }
            if (Number(amount) > limit) { return alertError(`plan is limited to ${limit} links per QR-set. Contact us if you need to increase limits.`) }
            addQRSet(
              title, 
              Number(amount),
              (id) => {
                history.push(`/qrs/${id}`)
              }
            )
          }}
        />
      </Buttons>
      
    </WidgetComponent>
  </Container>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(QRCreate)

import { FC, useState } from 'react'
import {
  Header,
  HeaderTitle,
  HeaderInfo,
  HeaderUserInfo,
  HeaderUserInfoPadded,
  HeaderUserInfoAddress,
  MiniPopupCustomItem,
  PolygonIcon,
  Logout,
  HeaderNetwork
} from './styled-components'
import {
  shortenString,
  defineNetworkName,
  capitalize,
  defineNativeTokenSymbol,
  defineNetworkIcon
} from 'helpers'
import { RootState } from 'data/store'
import { connect } from 'react-redux'
import * as asyncUserActions from 'data/store/reducers/user/async-actions'
import MiniPopup from '../mini-popup'
import chains from 'configs/chains'
import { IProps } from './types'
import { IAppDispatch } from 'data/store'
import { utils } from 'ethers5'
import Icons from 'icons'
import { useAccount } from 'wagmi'

const mapStateToProps = ({
  user: {
    chainId, 
    address, 
    provider, 
    nativeTokenAmount,
    chainsAvailable
  }
}: RootState) => ({
  chainId,
  address,
  provider,
  nativeTokenAmount,
  chainsAvailable
})

const mapDispatcherToProps = (dispatch: IAppDispatch ) => {
  return {
    switchNetwork: (chain: number, callback: () => void) => dispatch(asyncUserActions.switchNetwork(chain, callback)),
    logout: () => dispatch(asyncUserActions.logout())
  }
}

// @ts-ignore
type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>

const HeaderComponent: FC<IProps & ReduxType> = ({
  chainId,
  address,
  nativeTokenAmount,
  switchNetwork,
  provider,
  logout,
  title,
  breadcrumbs,
  chainsAvailable
}) => {
  const [ showToggleChain, setShowToggleChain ] = useState(false)
  const { connector } = useAccount()
  const nativeTokenAmountFormatted = nativeTokenAmount ? utils.formatEther(nativeTokenAmount) : 0
  const chainsPopup = showToggleChain && <MiniPopup onClose={() => { setShowToggleChain(false) }}>
    {Object.keys(chains).map((chain: string) => {
      if (
        chainsAvailable.length > 0 &&
        !chainsAvailable.find(network => Number(chain) === Number(network))
      ) {
        return null
      }

      if (chain === '13371') {
        return null
      }
      const currentChain = chains[Number(chain)]
      return <MiniPopupCustomItem
        onClick={() => {
          switchNetwork(Number(chain), () => { window.location.reload() })
        }}
        active={Number(chainId) === Number(chain)}
      > 
        <HeaderNetwork src={defineNetworkIcon(Number(chain))}/>
        {currentChain.displayName}
      </MiniPopupCustomItem>
    })}
  </MiniPopup>

  // onClick={() => {
  //   logout()
  // }}

  return <Header breadcrumbs={breadcrumbs}>
    <HeaderTitle>
      {title}
      {breadcrumbs}
    </HeaderTitle>
    <HeaderInfo>
      {chainId && <HeaderUserInfo onClick={() => {
        setShowToggleChain(!showToggleChain)
      }}>
        <HeaderNetwork src={defineNetworkIcon(chainId)}/>
        {capitalize(defineNetworkName(chainId))}
        {chainsPopup}
      </HeaderUserInfo>}
      {address && <HeaderUserInfoPadded>
        {nativeTokenAmount !== null ? parseFloat(Number((nativeTokenAmountFormatted)).toFixed(3)) : 0} {defineNativeTokenSymbol({ chainId })}
        <HeaderUserInfoAddress>{shortenString(address)}</HeaderUserInfoAddress>
      </HeaderUserInfoPadded>}

      {chainId && address && <Logout
        onClick={() => {
          connector?.disconnect()
          logout()
        }}
      >
        <Icons.LogoutIcon />
      </Logout>}
    </HeaderInfo>
  </Header>
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatcherToProps)(HeaderComponent)
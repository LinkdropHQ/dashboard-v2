import { TFeatureName } from 'types'

type TAddressConfig = Record<
  string,
  {
    qrConfig?: string
    betaFeaturesAvailable?: TFeatureName[]
    claimAppUrl?: string
  }
>

const COINBASE_CONFIG = {
  qrConfig: 'coinbase'
}

const LEDGER_CONFIG = {
  qrConfig: 'ledger',
  claimAppUrl: 'https://ldgr.linkdrop.io'
}

const ALPHEMY_CONFIG = {
  claimAppUrl: 'https://alphemy.linkdrop.io'
}

export const addressSpecificOptions: TAddressConfig = {
  '0xe78f82c63f9237ce12c415afc547fa80e1575629': COINBASE_CONFIG,
  '0x902b0bc91546a454bc70320dd9917f0def81c033': COINBASE_CONFIG,
  '0xaf62901baef02ea76eda62793bcbd66770a20bf7': COINBASE_CONFIG,
  '0xd756da6e34522f534a811c96e5e3668b38a76a22': COINBASE_CONFIG,
  '0xf96f058d4197f0e8e8284ae4123b38e4701c93fd': COINBASE_CONFIG,
  '0xf2b95635fc6cf3ebc8b5ca01c4e683a22b2e662c': COINBASE_CONFIG,
  '0xf92f4c77ab90b6e0ee2ccb24fa176d151c5ba9d0': ALPHEMY_CONFIG,
  '0x241365e6eed258ac4a2824424b6802c0240e13eb': ALPHEMY_CONFIG,
  '0x1e5fac5151e7d6db73a0aa7d740e9fd7063d6dbb': ALPHEMY_CONFIG,
  '0x2254c74edd4220883d881894f349b954e15ec7a0': ALPHEMY_CONFIG,
  '0xadf49b9f133fb137e82b24f06d23e49c51f586c7': LEDGER_CONFIG,
  '0x0020eedeb84da1491081c1409b684f459b8f0697': COINBASE_CONFIG,
  'coinbase': COINBASE_CONFIG,
  '0xed19658cb0cef4fbf25685a54ec3e1ee2c981508': LEDGER_CONFIG
}

const { REACT_APP_INFURA_ID } = process.env

type TChains = {
  [chainId: number]: {
    chainName: string,
    displayName: string,
    nativeCurrency: {
      name: string,
      symbol: string,
      decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[]
  }
}

const chains: TChains = {
  137: {
    chainName: 'Polygon',
    displayName: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: [
      'https://poly-rpc.gateway.pokt.network/'
    ],
    blockExplorerUrls: [
      'https://polygonscan.com'
    ]
  },
  1: {
    chainName: 'Ethereum Mainnet',
    displayName: 'Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: [
      `https://mainnet.infura.io/v3/${REACT_APP_INFURA_ID}`
    ],
    blockExplorerUrls: [
      'https://etherscan.io'
    ]
  },
  5: {
    chainName: 'Goerli',
    displayName: 'Goerli',
    nativeCurrency: {
      name: 'GoerliETH',
      symbol: 'GoerliETH',
      decimals: 18
    },
    rpcUrls: [
      `https://goerli.infura.io/v3/${REACT_APP_INFURA_ID}`
    ],
    blockExplorerUrls: [
      'https://goerli.etherscan.io'
    ]
  },
  // 4: {
  //   chainName: 'Rinkeby Testnet',
  //   displayName: 'Rinkeby',
  //   nativeCurrency: {
  //     name: 'ETH',
  //     symbol: 'ETH',
  //     decimals: 18
  //   },
  //   rpcUrls: [
  //     `https://rinkeby.infura.io/v3/${REACT_APP_INFURA_ID}`
  //   ],
  //   blockExplorerUrls: [
  //     'https://rinkeby.etherscan.io'
  //   ]
  // },
  // 1313161554: {
  //   chainName: 'Aurora Mainnet',
  //   displayName: 'Aurora',
  //   nativeCurrency: {
  //     name: 'ETH',
  //     symbol: 'ETH',
  //     decimals: 18
  //   },
  //   rpcUrls: [
  //     'https://mainnet.aurora.dev/'
  //   ],
  //   blockExplorerUrls: [
  //     'https://aurorascan.dev'
  //   ]
  // },
  // 80001: {
  //   chainName: 'Matic(Polygon) Testnet Mumbai',
  //   displayName: 'Mumbai',
  //   nativeCurrency: {
  //     name: 'tMATIC',
  //     symbol: 'tMATIC',
  //     decimals: 18
  //   },
  //   rpcUrls: [
  //     'https://rpc-mumbai.matic.today'
  //   ],
  //   blockExplorerUrls: [
  //     'https://mumbai.polygonscan.com'
  //   ]
  // },
  // 100: {
  //   chainName: 'xDai',
  //   displayName: 'xDai',
  //   nativeCurrency: {
  //     name: 'xDai',
  //     symbol: 'xDai',
  //     decimals: 18
  //   },
  //   rpcUrls: [
  //     'https://rpc.xdaichain.com/'
  //   ],
  //   blockExplorerUrls: [
  //     'https://blockscout.com/xdai/mainnet'
  //   ]
  // }
}

export default chains
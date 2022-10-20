type TContracts = {
  [networkId: string | number]: {
    factory: string;
    minter_role: string;
  }
}

const contracts: TContracts = {
  4: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  }, // rinkeby
  1: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  }, // mainnet
  137: {
    factory: '0x632E4Ef82188d466462Aecdc0193059C4Cd294Ec',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  }, // polygon
  5: {
    factory: '0xD61C4f3834480fECaA2EdcF0006FfB3005daE300',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  },
  1313161554: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  }, // aurora
  80001: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  }, // mumbai
  100: {
    factory: '0x926923238FE6f4866E7FB29a05538e7C4C118a53',
    minter_role: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
  } // xdai
}

export default contracts
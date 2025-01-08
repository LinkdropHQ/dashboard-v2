
import {
  approveERC20V3,
  approveERC20,
  approveERC1155,
  approveERC721,
  approveAllERC20
} from './approve/index'

import initialization from "./initialization"
import getNativeTokenAmount from "./get-native-token-amount"
import getTokenAmount from "./get-token-amount"
import secure from "./secure"
import switchNetwork from "./switch-network"
import connectWallet from "./connect-wallet"
import authorize from "./authorize"
import logout from "./logout"
import checkIfApproved from "./check-if-approved"
import checkIfGranted from "./check-if-granted"
import grantRole from "./grant-role"
import initialLoad from "./initial-load"
import getContracts from './get-contracts'
import getERC20Contracts from './get-erc20-contracts'
import getComission from './get-comission'
import getERC20TokenList from './get-erc20-token-list'
import getDashboardKey from './get-dashboard-key'
import signDashboardKey from './sign-dashboard-key'
import useDashboardKey from './use-dashboard-key'
import resetDashboardKeyPopup from './reset-dashboard-key-popup'

export {
  approveERC20,
  signDashboardKey,
  resetDashboardKeyPopup,
  useDashboardKey,
  getDashboardKey,
  getERC20TokenList,
  approveAllERC20,
  getNativeTokenAmount,
  approveERC20V3,
  initialization,
  getTokenAmount,
  secure,
  initialLoad,
  switchNetwork,
  connectWallet,
  approveERC721,
  approveERC1155,
  authorize,
  logout,
  checkIfApproved,
  checkIfGranted,
  grantRole,
  getContracts,
  getComission,
  getERC20Contracts
}
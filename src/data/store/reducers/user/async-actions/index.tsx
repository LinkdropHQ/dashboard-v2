import approveERC20 from "./approve-erc20"
import approveAllERC20 from './approve-all-erc20'
import approveERC721 from "./approve-erc721"
import approveERC1155 from "./approve-erc1155"
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
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
yarn install          # Install dependencies
yarn start            # Run development server (localhost:3000)
yarn build            # Production build to /build folder
yarn test             # Run tests with Jest
yarn test --watch     # Run tests in watch mode
```

Note: The project uses CRACO to override Create React App configuration.

## Architecture Overview

This is the Linkdrop Dashboard, a React 18 application for managing crypto token distribution campaigns via claim links. It supports ERC-20, ERC-721, and ERC-1155 tokens across Ethereum, Polygon, and Base networks.

### State Management

- **Redux + Redux Thunk** for global state (`src/data/store/`)
- **React Query** for server state and caching
- Reducers: `user`, `contract`, `campaign`, `campaigns`, `qrs`, `dispensers`, `collections`, `qrManager`

### Wallet Integration

- **Wagmi v2** + **Web3Modal** for wallet connections
- Configured in `src/components/application/connectors/index.tsx`
- Supports WalletConnect, injected wallets, and Coinbase Wallet
- Custom hook `useEthersSigner` bridges wagmi to ethers.js signers

### Routing

- **React Router v5** with HashRouter
- Routes defined in `src/components/application/app-router/index.tsx`
- `ProtectedRoute` component guards authenticated routes

### Key Directories

- `src/components/pages/` - Page components (campaigns, collections, dispensers, QRs)
- `src/components/common/` - Reusable UI components
- `src/data/api/` - API service functions for backend communication
- `src/data/store/reducers/` - Redux reducers with actions and types
- `src/helpers/` - Utility functions (90+ helpers for crypto, formatting, validation)
- `src/configs/` - Configuration for chains, contracts, QR options
- `src/types/` - TypeScript type definitions
- `src/abi/` - Smart contract ABIs

### Campaign Creation Flow

Campaigns follow a multi-step wizard pattern:
1. `/campaigns/new` - Select campaign type
2. `/campaigns/new/:type/initial` - Initial setup
3. `/campaigns/new/:type/approve` - Token approval (ERC-20/721/1155)
4. `/campaigns/new/:type/secure` - Security settings
5. `/campaigns/new/:type/generate` - Generate claim links

### Styling

- **styled-components** for CSS-in-JS
- Component styling files named `styled-components.tsx` alongside components
- Global styles in `src/index.css`

### External Services

- Linkdrop Batch SDK (`linkdrop-batch-sdk`) for link generation
- Alchemy SDK for blockchain data
- Datadog for RUM and logging
- Plausible for analytics

## Environment Variables

Required variables are documented in README.md. Key ones:
- `REACT_APP_INFURA_ID` - Infura API key
- `REACT_APP_SERVER_URL` - Backend API endpoint
- `REACT_APP_CLAIM_APP` - Claim application URL
- `REACT_APP_ALCHEMY_API_KEY` - Alchemy API key
- `REACT_APP_WC_PROJECT_ID` - WalletConnect project ID

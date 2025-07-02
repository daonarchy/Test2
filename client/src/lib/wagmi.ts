import { createConfig, http } from 'wagmi'
import { polygon, arbitrum, base, mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Configure wagmi
export const config = createConfig({
  chains: [polygon, arbitrum, base, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
    coinbaseWallet({
      appName: 'gTrade Clone',
      appLogoUrl: 'https://gains.trade/logo.svg',
    }),
  ],
  transports: {
    [polygon.id]: http('https://polygon-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
})
import './App.css';
import Home from './Components/Home';

import {
  WagmiConfig,
  createClient,
  chain,
  configureChains
} from 'wagmi';

import { infuraProvider } from 'wagmi/providers/infura'

import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.rinkeby
  ], 
  [
    infuraProvider({ apiKey: 'ca6d1763ecd846e2a2cb404d36fd6914' })
  ]
)

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    })
  ],
  provider,
  webSocketProvider
})

function App() {
  return (
    <div id="container">
      <WagmiConfig client={client}>
        <Home />
      </WagmiConfig>
    </div>
  );
}
export default App;
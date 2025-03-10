'use client';
import React, { ReactNode, useEffect } from 'react'
import { PrexUIKitSimpleProvider, USDC_TOKEN_ARBITRUM, usePrex, WETH_TOKEN_ARBITRUM } from '@prex0/uikit';
import '@rainbow-me/rainbowkit/styles.css'; // [!code focus]
import { http, createConfig, useConnectorClient } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RainbowKitProvider,
  connectorsForWallets  
} from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  rabbyWallet,
  okxWallet
} from '@rainbow-me/rainbowkit/wallets'

const queryClient = new QueryClient()

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        rabbyWallet,
        okxWallet,
      ]
    }
  ],
  {
    appName: 'SwapApp',
    projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ''
  }
)

export const config = createConfig({
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http()
  },
  connectors
});

export function ProvidersForExternalWallet({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
          <PrexProviderWithConnector>
            <RainbowKitProvider modalSize='compact'>
              {children}
            </RainbowKitProvider>
          </PrexProviderWithConnector>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


function PrexProviderWithConnector({ children }: { children: ReactNode }) {
  return (
    <PrexUIKitSimpleProvider
      chainId={42161}
      policyId={process.env.NEXT_PUBLIC_POLICY_ID || 'test'}
      apiKey={process.env.NEXT_PUBLIC_API_KEY || 'test'}
      tokens={[USDC_TOKEN_ARBITRUM, WETH_TOKEN_ARBITRUM]}
      dryRun={process.env.NEXT_PUBLIC_DRY_RUN === 'true'}
      useExternalWallet={true}
    >
      <InternalPrexProvider> 
        {children}
      </InternalPrexProvider>
    </PrexUIKitSimpleProvider>
  );
}

function InternalPrexProvider({ children }: { children: ReactNode }) {
  const client = useConnectorClient();
  const {setProvider} = usePrex();
 
  useEffect(() => {
    if(client.data) {
      setProvider(client.data as any);
    }
  }, [client.data, setProvider])

  return (
    <>
      {children}
    </>
  );
}
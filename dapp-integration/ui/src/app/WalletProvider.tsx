"use client";
// @ts-expect-error no type declarations for CSS side-effect import
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  oneKeyWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [oneKeyWallet],
    },
    { groupName: "Other", wallets: [walletConnectWallet] },
  ],
  {
    appName: "OneKey Vault Demo",
    projectId: "ad800d8abe2f4d7bf0027c4140e906fc",
  },
);

const config = createConfig({
  connectors,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
    [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
  },
});
const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00B812",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

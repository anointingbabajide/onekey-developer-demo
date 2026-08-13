import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function useWalletConnection() {
  const { address, isConnected, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  function connect() {
    openConnectModal?.();
  }

  return {
    address,
    isConnected,
    connectorName: connector?.name,
    chainName: chain?.name,
    connect,
    disconnect,
  };
}

import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import vaultAbi from "../abi/SimpleVaultABI.json";
import { VAULT_ADDRESS } from "./useInteractWithContract";

export function useVaultBalance() {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    functionName: "getBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    balance: data !== undefined ? formatEther(data as bigint) : "0.0000",
    isLoading,
    refetch,
  };
}

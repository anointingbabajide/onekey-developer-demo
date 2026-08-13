import { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWatchContractEvent } from "wagmi";
import { formatEther } from "viem";
import { sepolia } from "wagmi/chains";
import vaultAbi from "../abi/SimpleVaultABI.json";
import { VAULT_ADDRESS } from "./useInteractWithContract";

const VAULT_DEPLOY_BLOCK = 11466769n;

export type VaultActivityEntry = {
  type: "Deposit" | "Withdraw";
  amount: string;
  hash: string;
  txHash: `0x${string}`;
};

function truncateHash(hash: string) {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

export function useVaultActivity(limit = 10) {
  const publicClient = usePublicClient({ chainId: sepolia.id });
  const [activity, setActivity] = useState<VaultActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    if (!publicClient) return;
    setIsLoading(true);

    const [deposits, withdrawals] = await Promise.all([
      publicClient.getContractEvents({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        eventName: "Deposited",
        fromBlock: VAULT_DEPLOY_BLOCK,
        toBlock: "latest",
      }),
      publicClient.getContractEvents({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        eventName: "Withdrawn",
        fromBlock: VAULT_DEPLOY_BLOCK,
        toBlock: "latest",
      }),
    ]);

    const entries: VaultActivityEntry[] = [...deposits, ...withdrawals]
      .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
      .slice(0, limit)
      .map((log: any) => ({
        type: log.eventName === "Deposited" ? "Deposit" : "Withdraw",
        amount: formatEther((log.args as { amount: bigint }).amount),
        hash: truncateHash(log.transactionHash),
        txHash: log.transactionHash,
      }));

    setActivity(entries);
    setIsLoading(false);
  }, [publicClient, limit]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useWatchContractEvent({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    eventName: "Deposited",
    chainId: sepolia.id,
    onLogs(logs: any) {
      const entries: VaultActivityEntry[] = logs.map((log: any) => ({
        type: "Deposit",
        amount: formatEther((log.args as { amount: bigint }).amount),
        hash: truncateHash(log.transactionHash),
        txHash: log.transactionHash,
      }));
      setActivity((prev) => [...entries, ...prev].slice(0, limit));
    },
  });

  useWatchContractEvent({
    address: VAULT_ADDRESS,
    abi: vaultAbi,
    eventName: "Withdrawn",
    chainId: sepolia.id,
    onLogs(logs: any) {
      const entries: VaultActivityEntry[] = logs.map((log: any) => ({
        type: "Withdraw",
        amount: formatEther((log.args as { amount: bigint }).amount),
        hash: truncateHash(log.transactionHash),
        txHash: log.transactionHash,
      }));
      setActivity((prev) => [...entries, ...prev].slice(0, limit));
    },
  });

  return { activity, isLoading, refetch: loadHistory };
}

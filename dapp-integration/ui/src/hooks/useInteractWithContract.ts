import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { sepolia } from "wagmi/chains";
import vaultAbi from "../abi/SimpleVaultABI.json";

export const VAULT_ADDRESS = "0x42f2788320aB8375651FcE21538620Ee3a8cfe0B";

export function useDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function deposit(amountEth: string) {
    writeContract({
      address: VAULT_ADDRESS,
      abi: vaultAbi,
      functionName: "deposit",
      value: parseEther(amountEth),
      chainId: sepolia.id,
    });
  }

  return { deposit, hash, isPending, isConfirming, isConfirmed, error };
}

export function useWithdraw() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function withdraw(amountEth: string) {
    writeContract({
      address: VAULT_ADDRESS,
      abi: vaultAbi,
      functionName: "withdraw",
      args: [parseEther(amountEth)],
      chainId: sepolia.id,
    });
  }

  return { withdraw, hash, isPending, isConfirming, isConfirmed, error };
}

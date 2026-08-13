import type { TypedData } from "../../auth/hardware/signing";

export const withdrawalTypes = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
  ],
  WithdrawalRequest: [
    { name: "recipient", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

export function buildWithdrawalTypedData(params: {
  chainId: number;
  recipient: string;
  amountWei: bigint;
  nonce: number;
  deadlineUnix: number;
}): TypedData {
  return {
    types: withdrawalTypes,
    primaryType: "WithdrawalRequest",
    domain: {
      name: "OneKeyDemoAuth",
      version: "1",
      chainId: params.chainId,
    },
    message: {
      recipient: params.recipient,
      amount: params.amountWei.toString(),
      nonce: params.nonce,
      deadline: params.deadlineUnix,
    },
  };
}

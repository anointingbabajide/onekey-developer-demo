import { verifyTypedData } from "ethers";
import { withdrawalTypes } from "../eip712/withdrawal";

interface VerifyParams {
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
  signature: string;
  expectedSigner: string;
}

export function verifyWithdrawalSignature(params: VerifyParams): {
  valid: boolean;
  recoveredAddress: string;
} {
  const recoveredAddress = verifyTypedData(
    params.domain,
    Object.fromEntries(
      Object.entries(withdrawalTypes).filter(([k]) => k !== "EIP712Domain"),
    ),
    params.message,
    params.signature,
  );

  return {
    valid:
      recoveredAddress.toLowerCase() === params.expectedSigner.toLowerCase(),
    recoveredAddress,
  };
}

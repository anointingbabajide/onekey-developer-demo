import HardwareSDK from "@onekeyfe/hd-common-connect-sdk";
import { verifyTypedData } from "ethers";

export type TypedData = {
  types: Record<string, { name: string; type: string }[]> & {
    EIP712Domain: { name: string; type: string }[];
  };
  primaryType: string;
  domain: Record<string, unknown>;
  message: Record<string, unknown>;
};

export async function signTypedData(
  connectId: string,
  deviceId: string,
  path: string,
  typedData: TypedData,
  expectedAddress: string,
  chainId?: number,
): Promise<{ address: string; signature: string }> {
  const res = await HardwareSDK.evmSignTypedData(connectId, deviceId, {
    path,
    data: typedData,
    metamaskV4Compat: true,
    ...(chainId !== undefined ? { chainId } : {}),
  });

  if (!res.success) {
    throw new Error(res.payload?.error ?? "EIP-712 signing failed");
  }

  const rawSignature = res.payload.signature;
  const signature = rawSignature.startsWith("0x")
    ? rawSignature
    : `0x${rawSignature}`;

  const recovered = verifyTypedData(
    typedData.domain,
    Object.fromEntries(
      Object.entries(typedData.types).filter(([k]) => k !== "EIP712Domain"),
    ),
    typedData.message,
    signature,
  );

  if (recovered.toLowerCase() !== expectedAddress.toString().toLowerCase()) {
    throw new Error(
      `Signature does not recover to signing address: expected ${expectedAddress}, got ${recovered}`,
    );
  }

  return { address: expectedAddress, signature };
}

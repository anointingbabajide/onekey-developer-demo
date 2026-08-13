// src/tx/routes/withdraw.ts
import { Router } from "express";
import { signTypedData } from "../../auth/hardware/signing";
import { getActiveDevice } from "./device";
import { buildWithdrawalTypedData } from "../../evmSignTypedData/eip712/withdrawal";
import { verifyWithdrawalSignature } from "../../evmSignTypedData/wallet/verifier";
import { getEvmAddress } from "../../auth/hardware/onekey";

const router = Router();

function asError(err: unknown) {
  return err instanceof Error ? err.message : "Unknown error";
}

router.post("/sign", async (req, res) => {
  try {
    const activeDevice = getActiveDevice();
    if (!activeDevice) {
      return res.status(404).json({ error: "No OneKey device found" });
    }

    const { recipient, amountWei, nonce, deadlineUnix, path, chainId } =
      req.body;

    const typedData = buildWithdrawalTypedData({
      chainId,
      recipient,
      amountWei: BigInt(amountWei),
      nonce,
      deadlineUnix,
    });

    const expectedAddress = await getEvmAddress(
      activeDevice.connectId,
      activeDevice.deviceId,
      path,
    );

    const { address, signature } = await signTypedData(
      activeDevice.connectId,
      activeDevice.deviceId,
      path,
      typedData,
      expectedAddress,
      chainId,
    );

    res.json({ typedData, address, signature, device: activeDevice });
  } catch (err) {
    res.status(500).json({ error: asError(err) });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { domain, message, signature, expectedSigner } = req.body;

    const { valid, recoveredAddress } = verifyWithdrawalSignature({
      domain,
      message,
      signature,
      expectedSigner,
    });

    if (!valid) {
      return res.status(401).json({
        status: "rejected",
        reason: "signature does not match expected signer",
        recoveredAddress,
      });
    }

    res.json({ status: "authorized", recoveredAddress, message });
  } catch (err) {
    res.status(500).json({ error: asError(err) });
  }
});

export default router;

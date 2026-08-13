import { Router } from "express";
import {
  searchDevices,
  getEvmAddress,
  OneKeyDevice,
  relaxSafetyChecks,
} from "../../auth/hardware/onekey";

const router = Router();

// Cache the active device so we don't re-search on every request
let activeDevice: OneKeyDevice | null = null;

function asError(err: unknown) {
  return err instanceof Error ? err.message : "Unknown error";
}

router.get("/status", (_req, res) => {
  res.json({ connected: !!activeDevice, device: activeDevice });
});

router.post("/search", async (_req, res) => {
  try {
    const devices = await searchDevices();
    activeDevice = devices[0] ?? null;
    if (activeDevice) {
      await relaxSafetyChecks(activeDevice.connectId);
    }
    res.json({ devices, active: activeDevice });
  } catch (err) {
    res.status(500).json({ error: asError(err) });
  }
});

router.post("/address", async (req, res) => {
  try {
    if (!activeDevice) {
      const devices = await searchDevices();
      activeDevice = devices[0] ?? null;
      if (activeDevice) {
        await relaxSafetyChecks(activeDevice.connectId);
      }
    }
    if (!activeDevice) {
      return res.status(404).json({ error: "No OneKey device found" });
    }
    const path = req.body?.path as string | undefined;
    const address = await getEvmAddress(
      activeDevice.connectId,
      activeDevice.deviceId,
      path,
    );
    res.json({ address, device: activeDevice });
  } catch (err) {
    res.status(500).json({ error: asError(err) });
  }
});

export default router;
export function getActiveDevice() {
  return activeDevice;
}

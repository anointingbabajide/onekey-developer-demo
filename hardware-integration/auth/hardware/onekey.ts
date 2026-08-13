import HardwareSDK from "@onekeyfe/hd-common-connect-sdk";
import { UI_EVENT, UI_REQUEST, UI_RESPONSE } from "@onekeyfe/hd-core";

let initialized = false;

async function init() {
  if (initialized) return;
  await HardwareSDK.init({ debug: true, env: "node" });

  HardwareSDK.on(UI_EVENT, (message: any) => {
    if (message.type === UI_REQUEST.REQUEST_PIN) {
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PIN,
        payload: "@@ONEKEY_INPUT_PIN_IN_DEVICE",
      });
    }
    if (message.type === UI_REQUEST.REQUEST_PASSPHRASE) {
      HardwareSDK.uiResponse({
        type: UI_RESPONSE.RECEIVE_PASSPHRASE,
        payload: { value: "", passphraseOnDevice: true, save: false },
      });
    }
  });

  initialized = true;
}
export type OneKeyDevice = {
  connectId: string;
  deviceId: string;
};

export async function searchDevices(): Promise<OneKeyDevice[]> {
  await init();
  const result = await HardwareSDK.searchDevices();
  if (!result.success)
    throw new Error(result.payload?.error ?? "search failed");
  return result.payload.map((d: any) => ({
    connectId: d.connectId,
    deviceId: d.deviceId,
  }));
}

export async function getEvmAddress(
  connectId: string,
  deviceId: string,
  path = "m/44'/60'/0'/0/0",
) {
  const res = await HardwareSDK.evmGetAddress(connectId, deviceId, {
    path,
    showOnOneKey: true,
  });
  if (!res.success) throw new Error(res.payload?.error ?? "get address failed");
  return res.payload.address as string;
}

export async function relaxSafetyChecks(connectId: string) {
  const res = await HardwareSDK.deviceSettings(connectId, {
    safetyChecks: 2,
  } as any);
  if (!res.success) {
    throw new Error(res.payload?.error ?? "failed to set safety checks");
  }
}

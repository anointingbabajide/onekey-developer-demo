# OneKey Vault Demo

A hardware-signed deposit and withdrawal demo built with OneKey, covering both sides of the OneKey developer experience: **dApp integration** (browser wallet connection) and **direct hardware integration** (Node SDK, physical device communication).

Built as a technical walkthrough for [video link].

## What this demonstrates

**Part 1: dApp Integration**

- `SimpleVault.sol`, a minimal Solidity contract (deposit / withdraw / getBalance), deployed on Sepolia
- Next.js frontend using RainbowKit + wagmi/viem
- OneKey connects like any other wallet via RainbowKit's default wallet list, no extra config needed
- Every deposit/withdraw triggers a real hardware approval prompt on the connected OneKey device
- Live on-chain activity feed via contract event listeners (`Deposited` / `Withdrawn`)

**Part 2: Hardware Integration**

- A small Node.js backend using `@onekeyfe/hd-common-connect-sdk` (`env: 'node'`), talking to the physical device directly, not through a browser
- Device discovery, device info (model/firmware), and address verification shown on the device's own screen
- EIP-712 typed-data signing: the backend constructs a withdrawal authorization, OneKey signs it, and the backend verifies the signature off-chain (broadcasting is mocked in this demo, no real transfer is sent)
- Demonstrates the key security boundary: the backend never holds the OneKey private key, it only ever verifies a signed authorization, without needing custody of funds to do so

## Why two separate signing paths

|           | Part 1 (dApp)                          | Part 2 (Backend)                                      |
| --------- | -------------------------------------- | ----------------------------------------------------- |
| Who signs | Each end user, with their own OneKey   | One operator-controlled OneKey                        |
| Transport | Browser injected provider / RainbowKit | Node SDK, direct USB via OneKey Bridge                |
| Use case  | Personal wallet custody                | Service-level authorization (e.g. approving a payout) |

This mirrors how OneKey's own docs separate these two integration paths, and reflects a real production pattern: a hardware-backed signing service that authorizes backend actions without ever exposing a raw private key in code.

## Project structure

```
onekeywallet/
├── dapp-integration/
│   ├── contracts/
│   │   └── SimpleVault.sol
│   └── ui/                    # Next.js frontend
│       └── src/
│           ├── app/
│           │   ├── page.tsx           # Vault UI
│           │   └── WalletProvider.tsx # RainbowKit + wagmi config
│           └── hooks/
│               ├── useInteractWithContract.ts
│               ├── useVaultBalance.ts
│               ├── useVaultActivity.ts
│               └── useWalletConnection.ts
└── hardware-integration/       # Hardware signing service
    ├── auth/hardware/
    │   ├── onekey.ts           # SDK init, device discovery
    │   └── signing.ts          # evmSignTypedData wrapper
    ├── evmSignTypedData/
    │   ├── eip712/
    │   │   └── withdrawal.ts   # Typed data builder
    │   └── wallet/
    │       └── verifier.ts     # Off-chain signature verification
    └── tx/routes/
        ├── device.ts
        └── withdraw.ts         # /sign and /verify endpoints
```

## Prerequisites

- Node.js 18+
- [OneKey Bridge](https://github.com/OneKeyHQ/onekey-bridge/releases) installed and running (required for the hardware-integration service's direct device connection. Not needed for the dApp section, which connects through the browser)
- A OneKey hardware wallet
- A WalletConnect Project ID ([cloud.walletconnect.com](https://cloud.walletconnect.com)) for the dApp's RainbowKit config
- Sepolia ETH for testing deposits/withdrawals in the dApp section

## Running the dApp

```bash
cd dapp-integration/ui
npm install
npm run dev
```

Connect OneKey via the wallet modal, deposit/withdraw against the deployed `SimpleVault` contract on Sepolia.

## Running the hardware integration service

```bash
cd hardware-integration
npm install
npm run start
```

Make sure OneKey Bridge is running and the device is connected via USB before starting the service. Check with `curl -L http://localhost:21320`.

`POST /sign` builds an EIP-712 withdrawal authorization and has OneKey sign it. `POST /verify` checks a signature against the authorized signer address. Note: this service signs and verifies only. It does not broadcast a transaction or move funds.

## Deployed contract

- `SimpleVault`: `0x42f2788320aB8375651FcE21538620Ee3a8cfe0B` (Sepolia)

## Disclaimer

This is a demo built for a technical walkthrough, not production-audited code. The contract and backend are intentionally minimal to focus on the OneKey integration itself. See [https://youtu.be/6ps_bcMf8q8] for the full explanation of the architecture and security model.

"use client";

import { Perforation } from "@/components/PerforationSeal";
import { Seal } from "@/components/VerficationSeal";
import { useVaultActivity } from "@/hooks/useVaultAtivity";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useVaultBalance } from "@/hooks/useVaultBalance";
import { useDeposit, useWithdraw } from "@/hooks/useInteractWithContract";
import { useState } from "react";

const c = {
  paper: "#e9e4d6",
  card: "#f6f2e6",
  ink: "#211f1a",
  inkSoft: "#5c5847",
  rule: "#d3ccb8",
  green: "#188a3e",
  oxblood: "#a8452e",
};

function truncateAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function Home() {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");

  const { activity, isLoading: activityLoading } = useVaultActivity();
  const { address, isConnected, connect, disconnect } = useWalletConnection();
  const {
    balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useVaultBalance();
  const {
    deposit,
    isPending: depositPending,
    isConfirming: depositConfirming,
    isConfirmed: depositConfirmed,
    error: depositError,
  } = useDeposit();
  const {
    withdraw,
    isPending: withdrawPending,
    isConfirming: withdrawConfirming,
    isConfirmed: withdrawConfirmed,
    error: withdrawError,
  } = useWithdraw();

  const accent = mode === "deposit" ? c.green : c.oxblood;
  const isPending = mode === "deposit" ? depositPending : withdrawPending;
  const isConfirming =
    mode === "deposit" ? depositConfirming : withdrawConfirming;
  const isConfirmed = mode === "deposit" ? depositConfirmed : withdrawConfirmed;
  const isBusy = isPending || isConfirming;

  const activeError = mode === "deposit" ? depositError : withdrawError;

  function handleSubmit() {
    if (!amount || !isConnected) return;
    if (mode === "deposit") {
      deposit(amount);
    } else {
      withdraw(amount);
    }
  }

  // Refresh balance once a tx confirms
  if (isConfirmed) {
    refetchBalance();
  }

  const buttonLabel = isPending
    ? "Approve on device…"
    : isConfirming
      ? "Confirming…"
      : mode === "deposit"
        ? "Sign & deposit"
        : "Sign & withdraw";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: c.paper,
        color: c.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      className="font-[family-name:var(--font-geist-sans)]"
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div
          style={{
            transform: "rotate(-0.4deg)",
            background: c.card,
            boxShadow: "0 18px 40px rgba(33,31,26,0.16)",
          }}
        >
          {/* Slip top */}
          <div style={{ padding: "28px 30px 22px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 22,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: c.inkSoft }}>ETH Vault</div>
                <div style={{ fontSize: 13, color: c.inkSoft }}>Sepolia</div>
              </div>
              <Seal verified={isConnected} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: 2 }}>
                Held balance
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: 46,
                    lineHeight: 1,
                  }}
                >
                  {balanceLoading ? "—" : balance}
                </span>
                <span style={{ fontSize: 15, color: c.inkSoft }}>ETH</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 14,
                paddingBottom: 14,
                borderTop: `1px solid ${c.rule}`,
                marginBottom: 18,
              }}
            >
              <div style={{ fontSize: 13 }}>
                {isConnected ? (
                  <span>
                    Connected ·{" "}
                    <span
                      style={{
                        fontFamily: "var(--font-geist-mono)",
                        color: c.inkSoft,
                      }}
                    >
                      {truncateAddress(address)}
                    </span>
                  </span>
                ) : (
                  <span style={{ color: c.inkSoft }}>
                    No hardware wallet connected
                  </span>
                )}
              </div>
              <button
                onClick={() => (isConnected ? disconnect() : connect())}
                style={{
                  fontSize: 13,
                  background: "transparent",
                  border: "none",
                  color: c.green,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  padding: 0,
                }}
              >
                {isConnected ? "Disconnect" : "Connect OneKey"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                marginBottom: 14,
                fontSize: 14,
              }}
            >
              <button
                onClick={() => setMode("deposit")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: mode === "deposit" ? c.ink : c.inkSoft,
                  fontWeight: mode === "deposit" ? 600 : 400,
                  borderBottom:
                    mode === "deposit"
                      ? `2px solid ${c.green}`
                      : "2px solid transparent",
                  paddingBottom: 4,
                }}
              >
                Deposit
              </button>
              <button
                onClick={() => setMode("withdraw")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: mode === "withdraw" ? c.ink : c.inkSoft,
                  fontWeight: mode === "withdraw" ? 600 : 400,
                  borderBottom:
                    mode === "withdraw"
                      ? `2px solid ${c.oxblood}`
                      : "2px solid transparent",
                  paddingBottom: 4,
                }}
              >
                Withdraw
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                border: `1px solid ${c.rule}`,
                marginBottom: 14,
                background: "#fdfbf4",
              }}
            >
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isBusy}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "11px 12px",
                  fontSize: 16,
                  fontFamily: "var(--font-geist-mono)",
                  color: c.ink,
                }}
              />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  fontSize: 12,
                  color: c.inkSoft,
                  borderLeft: `1px solid ${c.rule}`,
                }}
              >
                ETH
              </span>
            </div>

            <button
              disabled={!isConnected || !amount || isBusy}
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "11px 0",
                fontSize: 14,
                border: "none",
                background: accent,
                color: "#fdfbf4",
                cursor:
                  !isConnected || !amount || isBusy ? "not-allowed" : "pointer",
                opacity: !isConnected || !amount || isBusy ? 0.35 : 1,
              }}
            >
              {buttonLabel}
            </button>
          </div>

          {/* Perforation */}
          <Perforation />

          {/* Receipt stub */}
          <div style={{ padding: "18px 30px 26px" }}>
            <div style={{ fontSize: 12, color: c.inkSoft, marginBottom: 10 }}>
              Recent activity
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activityLoading && (
                <div style={{ fontSize: 12, color: c.inkSoft }}>Loading…</div>
              )}
              {!activityLoading && activity.length === 0 && (
                <div style={{ fontSize: 12, color: c.inkSoft }}>
                  No activity yet
                </div>
              )}
              {activity.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  <span
                    style={{
                      color: entry.type === "Deposit" ? c.green : c.oxblood,
                      width: 76,
                    }}
                  >
                    {entry.type}
                  </span>
                  <span>{entry.amount} ETH</span>
                  <span style={{ color: c.inkSoft }}>{entry.hash}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {activeError && (
          <div style={{ fontSize: 12, color: c.oxblood, marginTop: 8 }}>
            {activeError.message.split("\n")[0]}
          </div>
        )}
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 12,
            color: c.inkSoft,
          }}
        >
          Every transfer is signed on the device.
        </div>
      </div>
    </div>
  );
}

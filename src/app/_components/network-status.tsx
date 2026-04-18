"use client";

import { useWallet } from "@/hooks/useWallet";

export default function NetworkStatus() {
  const { chainId, isConnected } = useWallet();

  if (!isConnected) return null;

  const isSepolia = chainId === 11155111;

  return (
    <div
      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isSepolia ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
    >
      {isSepolia ? (
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Sepolia Testnet
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          Wrong Network
        </span>
      )}
    </div>
  );
}

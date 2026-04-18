"use client";

import { useWallet } from "@/hooks/useWallet";
import { formatAddress, formatBalance } from "@/lib/ether";

export default function WalletConnect() {
  const {
    account,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Connect MetaMask
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div>
          <p className="text-xs text-gray-400">Connected Account</p>
          <p className="font-mono text-sm font-semibold">
            {formatAddress(account)}
          </p>
        </div>
      </div>
      <div className="h-8 w-px bg-gray-700"></div>
      <div>
        <p className="text-xs text-gray-400">Balance</p>
        <p className="font-semibold text-green-400">{formatBalance(balance)}</p>
      </div>
      <button
        onClick={disconnectWallet}
        className="text-red-400 hover:text-red-300 transition-colors text-sm"
      >
        Disconnect
      </button>
    </div>
  );
}

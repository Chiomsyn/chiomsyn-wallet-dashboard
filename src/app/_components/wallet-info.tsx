"use client";

import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { toast } from "sonner";
import { ethers } from "ethers"; // Add this import
import { formatAddress, formatBalance } from "@/lib/ether";

export default function WalletInfo() {
  const { account, balance, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!account) return;
    await navigator.clipboard.writeText(account);
    setCopied(true);
    toast.success("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
        <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Wallet Connected</h3>
        <p className="text-gray-400">
          Click the Connect button above to get started
        </p>
      </div>
    );
  }

  // Convert balance to number for display
  const balanceNum = Number(ethers.formatEther(balance));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Wallet Overview</h3>

      <div className="space-y-4">
        <div className="p-4 bg-gray-900 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Account Address</p>
          <div className="flex items-center justify-between">
            <code className="font-mono text-sm text-white">
              {formatAddress(account)}
            </code>
            <button
              onClick={copyAddress}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {copied ? (
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-linear-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20">
          <p className="text-sm text-gray-400 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">
            {formatBalance(balance)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ~ ${(balanceNum * 2500).toFixed(2)} USD (estimated)
          </p>
        </div>

        <div className="p-4 bg-gray-900 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">Quick Actions</p>
          <div className="flex gap-2">
            <a
              href={`https://sepolia.etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition-colors"
            >
              View on Etherscan
            </a>
            <a
              href="https://sepolia-faucet.pk910.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 py-2 rounded-lg transition-colors"
            >
              Get Test ETH
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

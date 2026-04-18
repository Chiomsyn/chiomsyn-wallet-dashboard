"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import components that use window.ethereum
const WalletConnect = dynamic(() => import("./_components/wallet-connect"), {
  ssr: false,
});
const NetworkStatus = dynamic(() => import("./_components/network-status"), {
  ssr: false,
});
const WalletInfo = dynamic(() => import("./_components/wallet-info"), {
  ssr: false,
});
const SendTransaction = dynamic(
  () => import("./_components/send-transaction"),
  { ssr: false },
);
const TransactionHistory = dynamic(
  () => import("./_components/transaction-history"),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 to-blue-600/20 blur-3xl"></div>

        <div className="relative container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Chiomsyn Wallet Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Your Web3 wallet interface for Sepolia Testnet
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Suspense
                fallback={
                  <div className="h-10 w-32 bg-gray-800 animate-pulse rounded-lg"></div>
                }
              >
                <NetworkStatus />
              </Suspense>
              <Suspense
                fallback={
                  <div className="h-12 w-32 bg-gray-800 animate-pulse rounded-xl"></div>
                }
              >
                <WalletConnect />
              </Suspense>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Suspense
              fallback={
                <div className="h-96 bg-gray-800/50 animate-pulse rounded-2xl"></div>
              }
            >
              <WalletInfo />
            </Suspense>
            <Suspense
              fallback={
                <div className="h-96 bg-gray-800/50 animate-pulse rounded-2xl"></div>
              }
            >
              <SendTransaction />
            </Suspense>
          </div>

          {/* Transaction History */}
          <Suspense
            fallback={
              <div className="h-64 bg-gray-800/50 animate-pulse rounded-2xl"></div>
            }
          >
            <TransactionHistory />
          </Suspense>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Built with Next.js, Tailwind CSS, and ethers.js</p>
            <p className="mt-1">
              Connected to Ethereum Sepolia Testnet — Get test ETH from a faucet
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

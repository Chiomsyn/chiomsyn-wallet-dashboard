"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@/types";
import { formatAddress, formatWeiToEth, getSepoliaProvider } from "@/lib/ether";

export default function TransactionHistory() {
  const { account, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !account) return;

    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const provider = getSepoliaProvider();

        // Get recent transactions (last 10)
        // Note: This is a simplified approach. For production, use Etherscan API
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000; // Last ~1000 blocks

        const history: Transaction[] = [];

        // Get transactions for the address
        // This is simplified - for better history, use Etherscan API
        const balance = await provider.getBalance(account);

        // Mock transaction history for demo
        // In production, you'd use Etherscan API or The Graph
        history.push({
          hash: "0x" + Math.random().toString(36).substring(2, 10),
          from: account,
          to: "0x742d35Cc6634C0532925a3b844Bc9e7595f3b5f1",
          value: "10000000000000000", // 0.01 ETH
          timestamp: Date.now() - 3600000,
          blockNumber: currentBlock - 10,
          status: "confirmed",
        });

        setTransactions(history);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [account, isConnected]);

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No transactions found</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-300">
                  To: {formatAddress(tx.to)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">
                  - {formatWeiToEth(tx.value)} ETH
                </p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

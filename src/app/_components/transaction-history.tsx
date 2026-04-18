"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@/types";
import { formatAddress, formatWeiToEth } from "@/lib/ether";

export default function TransactionHistory() {
  const { account, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !account) {
      setTransactions([]);
      return;
    }

    const fetchTransactionsFromEtherscan = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from Etherscan API (optional)
        const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
        if (!apiKey) {
          console.log("No Etherscan API key - showing empty state");
          setTransactions([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${account}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`,
        );

        const data = await response.json();

        if (data.status === "1" && data.result) {
          const formattedTxs: Transaction[] = data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: parseInt(tx.timeStamp) * 1000,
            blockNumber: parseInt(tx.blockNumber),
            status: tx.txreceipt_status === "1" ? "confirmed" : "pending",
          }));
          setTransactions(formattedTxs);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsFromEtherscan();
  }, [account, isConnected]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        {account && (
          <a
            href={`https://sepolia.etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all on Etherscan →
          </a>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-700 rounded-lg mb-3"></div>
            <div className="h-16 bg-gray-700 rounded-lg mb-3"></div>
            <div className="h-16 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-400 mb-2">No transaction history found</p>
          <p className="text-sm text-gray-500">
            Send a transaction using the form above, or{" "}
            <a
              href={`https://sepolia.etherscan.io/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              view on Etherscan
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.from.toLowerCase() === account?.toLowerCase()
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {tx.from.toLowerCase() === account?.toLowerCase()
                      ? "SENT"
                      : "RECEIVED"}
                  </span>
                  <p className="font-mono text-sm text-gray-300 truncate">
                    {tx.from.toLowerCase() === account?.toLowerCase()
                      ? `To: ${formatAddress(tx.to)}`
                      : `From: ${formatAddress(tx.from)}`}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right ml-4">
                <p
                  className={`font-semibold ${
                    tx.from.toLowerCase() === account?.toLowerCase()
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {tx.from.toLowerCase() === account?.toLowerCase() ? "-" : "+"}{" "}
                  {formatWeiToEth(tx.value)} ETH
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

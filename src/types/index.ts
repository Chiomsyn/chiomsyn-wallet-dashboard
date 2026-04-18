export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  status?: "pending" | "confirmed" | "failed";
}

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  networkName: string;
}

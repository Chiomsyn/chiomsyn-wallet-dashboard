import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getEthereumProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const getSepoliaProvider = () => {
  const rpcUrl =
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: bigint) => {
  const eth = ethers.formatEther(balance);
  return `${parseFloat(eth).toFixed(4)} ETH`;
};

export const formatWeiToEth = (wei: bigint | string) => {
  const weiBigInt = typeof wei === "string" ? BigInt(wei) : wei;
  return parseFloat(ethers.formatEther(weiBigInt)).toFixed(4);
};

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";

export const useWallet = () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const address = accounts[0];
            const providerInstance = new ethers.BrowserProvider(
              window.ethereum,
            );
            const balanceWei = await providerInstance.getBalance(address);
            const network = await providerInstance.getNetwork();

            setAccount(address);
            setBalance(balanceWei);
            setChainId(Number(network.chainId));
            setProvider(providerInstance);
            setIsConnected(true);

            console.log("Auto-connected to:", address);
          }
        } catch (error) {
          console.error("Failed to check connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const checkNetwork = useCallback(
    async (providerInstance: ethers.BrowserProvider) => {
      const network = await providerInstance.getNetwork();
      const chainIdNum = Number(network.chainId);
      setChainId(chainIdNum);

      if (chainIdNum !== 11155111) {
        toast.warning("Please switch to Sepolia testnet", {
          description: "This app works best on Ethereum Sepolia network",
          action: {
            label: "Switch Network",
            onClick: async () => {
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0xaa36a7" }],
                });
              } catch (error: any) {
                if (error.code === 4902) {
                  await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0xaa36a7",
                        chainName: "Sepolia Test Network",
                        nativeCurrency: {
                          name: "SepoliaETH",
                          symbol: "ETH",
                          decimals: 18,
                        },
                        rpcUrls: ["https://rpc.sepolia.org"],
                        blockExplorerUrls: ["https://sepolia.etherscan.io"],
                      },
                    ],
                  });
                } else {
                  toast.error("Failed to switch network");
                }
              }
            },
          },
        });
        return false;
      }
      return true;
    },
    [],
  );

  const fetchBalance = useCallback(
    async (address: string, providerInstance: ethers.BrowserProvider) => {
      try {
        const balanceWei = await providerInstance.getBalance(address);
        setBalance(balanceWei);
        return balanceWei;
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        return null;
      }
    },
    [],
  );

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask extension to use this app",
        duration: 5000,
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      const providerInstance = new ethers.BrowserProvider(window.ethereum);

      setProvider(providerInstance);
      setAccount(address);
      setIsConnected(true);

      await fetchBalance(address, providerInstance);
      await checkNetwork(providerInstance);

      toast.success("Wallet connected successfully!", {
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Connection error:", error);

      if (error.code === 4001) {
        toast.error("Connection rejected", {
          description: "Please approve the connection request in MetaMask",
        });
      } else {
        toast.error("Failed to connect wallet", {
          description: error.message || "Please try again",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBalance, checkNetwork]);

  const disconnectWallet = useCallback(() => {
    setAccount("");
    setBalance(BigInt(0));
    setIsConnected(false);
    setProvider(null);
    setChainId(0);
    toast.info("Wallet disconnected");
  }, []);

  const sendTransaction = useCallback(
    async (to: string, amountInEth: string) => {
      if (!provider || !account) {
        toast.error("Wallet not connected");
        return null;
      }

      try {
        const signer = await provider.getSigner();
        const amountWei = ethers.parseEther(amountInEth);

        const tx = await signer.sendTransaction({
          to,
          value: amountWei,
        });

        toast.loading("Transaction submitted...", {
          id: tx.hash,
          description: `Hash: ${tx.hash.slice(0, 10)}...`,
        });

        const receipt = await tx.wait();

        toast.success("Transaction confirmed!", {
          id: tx.hash,
          description: `Sent ${amountInEth} ETH to ${to.slice(0, 6)}...${to.slice(-4)}`,
          duration: 5000,
        });

        if (provider) {
          await fetchBalance(account, provider);
        }

        return receipt;
      } catch (error: any) {
        console.error("Transaction failed:", error);
        toast.error("Transaction failed", {
          description: error.message || "Please try again",
        });
        return null;
      }
    },
    [provider, account, fetchBalance],
  );

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          const newAddress = accounts[0];
          setAccount(newAddress);
          if (provider) {
            await fetchBalance(newAddress, provider);
          } else {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(newProvider);
            await fetchBalance(newAddress, newProvider);
          }
          toast.info("Account changed", {
            description: `Switched to ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`,
          });
        }
      };

      const handleChainChanged = () => {
        console.log("Chain changed, reloading...");
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [account, provider, fetchBalance, disconnectWallet]);

  return {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };
};

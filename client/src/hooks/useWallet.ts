import { useState, useEffect } from "react";

// Mock wallet hook - in production this would integrate with @farcaster/frame-wagmi-connector
export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number>(137); // Polygon

  // Mock connection status
  useEffect(() => {
    const savedConnection = localStorage.getItem("wallet_connected");
    const savedAddress = localStorage.getItem("wallet_address");
    
    if (savedConnection === "true" && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const connect = async () => {
    // Mock wallet connection
    try {
      // In production, this would use @farcaster/frame-wagmi-connector
      // For now, we'll simulate a successful connection
      const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
      
      setIsConnected(true);
      setAddress(mockAddress);
      
      localStorage.setItem("wallet_connected", "true");
      localStorage.setItem("wallet_address", mockAddress);
      
      return { success: true, address: mockAddress };
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      return { success: false, error };
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    
    localStorage.removeItem("wallet_connected");
    localStorage.removeItem("wallet_address");
  };

  const switchChain = async (newChainId: number) => {
    // Mock chain switching
    setChainId(newChainId);
    return { success: true };
  };

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      8453: "Base",
    };
    return chains[chainId] || "Unknown";
  };

  return {
    isConnected,
    address,
    chainId,
    chainName: getChainName(chainId),
    connect,
    disconnect,
    switchChain,
  };
}

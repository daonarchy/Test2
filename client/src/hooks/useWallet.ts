import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const connectWallet = async () => {
    try {
      connect({ connector: injected() });
      return { success: true, address };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error };
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const switchToChain = async (newChainId: number) => {
    try {
      switchChain({ chainId: newChainId });
      return { success: true };
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return { success: false, error };
    }
  };

  const getChainName = (chainId?: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      8453: "Base",
    };
    return chainId ? chains[chainId] || "Unknown" : "Unknown";
  };

  return {
    isConnected,
    address,
    chainId,
    chainName: getChainName(chainId),
    connect: connectWallet,
    disconnect: disconnectWallet,
    switchChain: switchToChain,
    isConnecting,
  };
}

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
import { useFarcasterWallet } from './useFarcasterWallet';

export function useWallet() {
  const farcasterWallet = useFarcasterWallet();
  const { address: wagmiAddress, isConnected: isWagmiConnected } = useAccount();
  const { connect: wagmiConnect, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const connect = async () => {
    try {
      // Try MetaMask first, then WalletConnect as fallback
      wagmiConnect({ connector: metaMask() });
    } catch (error) {
      console.error('Failed to connect:', error);
      // Fallback to WalletConnect
      try {
        wagmiConnect({ 
          connector: walletConnect({
            projectId: '12345', // Replace with actual project ID when available
            showQrModal: true,
          })
        });
      } catch (wcError) {
        console.error('WalletConnect failed:', wcError);
      }
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
  };

  // Return combined state prioritizing Farcaster when available
  return {
    isInFarcaster: farcasterWallet.isInFarcaster,
    user: farcasterWallet.user,
    address: farcasterWallet.address || wagmiAddress,
    isConnected: farcasterWallet.isInFarcaster ? !!farcasterWallet.address : isWagmiConnected,
    isLoading: isPending,
    connect,
    disconnect,
  };
}

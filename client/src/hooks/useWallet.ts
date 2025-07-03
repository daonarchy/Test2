import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
import { useFarcasterWallet } from './useFarcasterWallet';
import { gainsSDK } from '@/lib/gainsSDK';

export function useWallet() {
  const farcasterWallet = useFarcasterWallet();
  const { address: wagmiAddress, isConnected: isWagmiConnected, chainId } = useAccount();
  const { connect: wagmiConnect, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { switchChain: wagmiSwitchChain, isPending: isSwitchingChain } = useSwitchChain();
  
  const [currentChain, setCurrentChain] = useState<'polygon' | 'arbitrum' | 'base'>('arbitrum');

  useEffect(() => {
    // Load saved chain from localStorage
    const savedChain = localStorage.getItem('wallet_chain') as 'polygon' | 'arbitrum' | 'base';
    if (savedChain && ['polygon', 'arbitrum', 'base'].includes(savedChain)) {
      setCurrentChain(savedChain);
    }
  }, []);

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

  const switchChain = async (chainName: 'polygon' | 'arbitrum' | 'base') => {
    try {
      console.log(`Switching to ${chainName}...`);
      
      // Chain IDs mapping
      const chainIds = {
        polygon: 137,
        arbitrum: 42161,
        base: 8453
      };
      
      // Switch wagmi chain if connected
      if (isWagmiConnected) {
        wagmiSwitchChain({ chainId: chainIds[chainName] });
      }
      
      // Switch SDK to the new chain
      const success = await gainsSDK.switchChain(chainName);
      
      if (success) {
        setCurrentChain(chainName);
        localStorage.setItem('wallet_chain', chainName);
        console.log(`Successfully switched to ${chainName}`);
        return true;
      } else {
        throw new Error(`Failed to switch to ${chainName}`);
      }
    } catch (error) {
      console.error('Failed to switch chain:', error);
      return false;
    }
  };

  const getSupportedChains = () => {
    return gainsSDK.getSupportedChains();
  };

  const getChainInfo = (chainName: string) => {
    const chainData = {
      polygon: { name: 'Polygon', symbol: 'MATIC', color: 'purple', id: 137 },
      arbitrum: { name: 'Arbitrum', symbol: 'ETH', color: 'blue', id: 42161 },
      base: { name: 'Base', symbol: 'ETH', color: 'blue', id: 8453 }
    };
    return chainData[chainName as keyof typeof chainData];
  };

  // Return combined state prioritizing Farcaster when available
  return {
    isInFarcaster: farcasterWallet.isInFarcaster,
    user: farcasterWallet.user,
    address: farcasterWallet.address || wagmiAddress,
    isConnected: farcasterWallet.isInFarcaster ? !!farcasterWallet.address : isWagmiConnected,
    isLoading: isPending,
    currentChain,
    chainId,
    connect,
    disconnect,
    switchChain,
    isSwitchingChain,
    getSupportedChains,
    getChainInfo,
  };
}

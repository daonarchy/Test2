import { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

export type SupportedChain = 'arbitrum' | 'polygon' | 'base';

// Chain ID to name mapping
const CHAIN_ID_TO_NAME: Record<number, SupportedChain> = {
  42161: 'arbitrum',
  137: 'polygon',
  8453: 'base',
};

// Chain name to ID mapping
const CHAIN_NAME_TO_ID: Record<SupportedChain, number> = {
  arbitrum: 42161,
  polygon: 137,
  base: 8453,
};

export function useChain() {
  const { chain } = useAccount();
  const { switchChain: switchChainWagmi, isPending: isSwitchingChain } = useSwitchChain();
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('arbitrum');

  useEffect(() => {
    if (chain?.id && CHAIN_ID_TO_NAME[chain.id]) {
      setSelectedChain(CHAIN_ID_TO_NAME[chain.id]);
    }
  }, [chain?.id]);

  const switchChain = async (chainName: SupportedChain) => {
    const chainId = CHAIN_NAME_TO_ID[chainName];
    try {
      // This will trigger wallet popup for chain switching
      await switchChainWagmi({ chainId });
      setSelectedChain(chainName);
    } catch (error) {
      console.error('Failed to switch chain:', error);
      // If switching fails, still update UI state for demo purposes
      setSelectedChain(chainName);
    }
  };

  const getChainId = (chainName: SupportedChain): number => {
    return CHAIN_NAME_TO_ID[chainName];
  };

  const getChainName = (chainId: number): SupportedChain | undefined => {
    return CHAIN_ID_TO_NAME[chainId];
  };

  return {
    selectedChain,
    switchChain,
    getChainId,
    getChainName,
    connectedChain: chain,
    isConnectedToCorrectChain: chain?.id === CHAIN_NAME_TO_ID[selectedChain],
    isSwitchingChain,
  };
}
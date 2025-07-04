import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

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
  const [selectedChain, setSelectedChain] = useState<SupportedChain>('arbitrum');

  useEffect(() => {
    if (chain?.id && CHAIN_ID_TO_NAME[chain.id]) {
      setSelectedChain(CHAIN_ID_TO_NAME[chain.id]);
    }
  }, [chain?.id]);

  const switchChain = (chainName: SupportedChain) => {
    setSelectedChain(chainName);
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
  };
}
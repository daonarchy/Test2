import { useFarcasterWallet } from './useFarcasterWallet';

export function useWallet() {
  const farcasterWallet = useFarcasterWallet();

  return {
    ...farcasterWallet,
    isConnecting: farcasterWallet.isLoading,
  };
}

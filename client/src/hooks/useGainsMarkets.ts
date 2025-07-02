import { useQuery } from '@tanstack/react-query';
import { gainsSDK } from '../lib/gainsSDK';

export function useGainsMarkets(category?: string) {
  return useQuery({
    queryKey: ['gains-markets', category],
    queryFn: async () => {
      const markets = await gainsSDK.getMarkets();
      if (category) {
        return markets.filter(market => market.category === category);
      }
      return markets;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useGainsMarketPrice(pairIndex: number) {
  return useQuery({
    queryKey: ['gains-market-price', pairIndex],
    queryFn: () => gainsSDK.getMarketPrice(pairIndex),
    staleTime: 5000, // 5 seconds
    refetchInterval: 5000, // Refetch every 5 seconds
    enabled: pairIndex >= 0,
  });
}

export function useGainsPositions(walletAddress?: string) {
  return useQuery({
    queryKey: ['gains-positions', walletAddress],
    queryFn: () => gainsSDK.getPositions(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 10000,
    refetchInterval: 10000,
  });
}

export function useGainsOrders(walletAddress?: string) {
  return useQuery({
    queryKey: ['gains-orders', walletAddress],
    queryFn: () => gainsSDK.getOrders(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 10000,
    refetchInterval: 10000,
  });
}

export function useGainsLeaderboard() {
  return useQuery({
    queryKey: ['gains-leaderboard'],
    queryFn: () => gainsSDK.getLeaderboard(),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  });
}
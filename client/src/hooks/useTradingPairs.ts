import { useQuery } from "@tanstack/react-query";
import type { TradingPair } from "@shared/schema";

export function useTradingPairs(category?: string) {
  return useQuery<TradingPair[]>({
    queryKey: ["/api/trading-pairs", category],
    queryFn: async () => {
      const url = category 
        ? `/api/trading-pairs?category=${encodeURIComponent(category)}`
        : "/api/trading-pairs";
      
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trading pairs: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
    refetchInterval: false, // Disable automatic refetching to reduce lag
  });
}

export function useTradingPair(id: number) {
  return useQuery<TradingPair>({
    queryKey: ["/api/trading-pairs", id],
    enabled: !!id,
  });
}

export function useTradingPairBySymbol(symbol: string) {
  return useQuery<TradingPair>({
    queryKey: ["/api/trading-pairs/symbol", symbol],
    enabled: !!symbol,
  });
}

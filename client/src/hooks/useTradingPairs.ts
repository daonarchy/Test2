import { useQuery } from "@tanstack/react-query";
import type { TradingPair } from "@shared/schema";
import { gainsSDK } from "@/lib/gainsSDK";

export function useTradingPairs(category?: string) {
  return useQuery<TradingPair[]>({
    queryKey: ["gains-network-pairs", category],
    queryFn: async () => {
      try {
        // Fetch real trading pairs directly from Gains Network SDK
        console.log('Loading real trading pairs from Gains Network SDK...');
        const pairs = await gainsSDK.getMarkets();
        
        // Filter by category if specified
        if (category) {
          return pairs.filter((pair: any) => pair.category === category);
        }
        
        return pairs;
      } catch (error) {
        console.error('SDK connection failed:', error);
        throw new Error(`Unable to load Gains Network trading pairs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute to keep data updated
    retry: (failureCount, error) => {
      // Only retry up to 2 times for SDK failures
      if (failureCount < 2) {
        console.log(`Retrying SDK connection (attempt ${failureCount + 1}/2)...`);
        return true;
      }
      return false;
    },
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

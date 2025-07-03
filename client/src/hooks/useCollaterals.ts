import { useQuery } from "@tanstack/react-query";
import { gainsSDK } from "@/lib/gainsSDK";

export function useCollaterals() {
  return useQuery({
    queryKey: ["gains-network-collaterals"],
    queryFn: async () => {
      try {
        console.log('Loading collaterals from Gains Network SDK...');
        const collaterals = await gainsSDK.getCollaterals();
        console.log(`Successfully fetched ${collaterals.length} collaterals from Gains Network`);
        return collaterals;
      } catch (error) {
        console.error('Failed to fetch collaterals:', error);
        throw new Error(`Unable to load collaterals: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 300000, // Refetch every 5 minutes (collaterals change less frequently)
    retry: (failureCount, error) => {
      if (failureCount < 2) {
        console.log(`Retrying collaterals fetch (attempt ${failureCount + 1}/2)...`);
        return true;
      }
      return false;
    },
  });
}

export function useCollateral(symbol: string) {
  const { data: collaterals, ...rest } = useCollaterals();
  
  const collateral = collaterals?.find((c: any) => c.symbol === symbol);
  
  return {
    data: collateral,
    ...rest
  };
}
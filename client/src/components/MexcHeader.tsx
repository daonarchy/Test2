import { useWallet } from "@/hooks/useWallet";
import { useFarcasterWallet } from "@/hooks/useFarcasterWallet";
import { formatPrice, formatChange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TradingPair } from "@shared/schema";

interface MexcHeaderProps {
  selectedAsset: TradingPair | null;
}

export default function MexcHeader({ selectedAsset }: MexcHeaderProps) {
  const { isConnected: isWagmiConnected, address: wagmiAddress, connect, disconnect } = useWallet();
  const { isInFarcaster, user, address: farcasterAddress } = useFarcasterWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const isConnectedViaFarcaster = isInFarcaster && user && farcasterAddress;
  const isConnectedViaWagmi = !isInFarcaster && isWagmiConnected && wagmiAddress;
  const isConnected = isConnectedViaFarcaster || isConnectedViaWagmi;
  const address = farcasterAddress || wagmiAddress;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center space-x-3">
          <div className="text-yellow-400 font-bold text-lg">gTrade</div>
          <div className="text-gray-400">Futures</div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="text-gray-400">Base</span>
          </div>
          
          {isConnectedViaFarcaster ? (
            <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium">
              @{user?.username}
            </div>
          ) : isConnectedViaWagmi ? (
            <div className="flex items-center space-x-2">
              <div className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium">
                {`${wagmiAddress?.slice(0, 4)}...${wagmiAddress?.slice(-4)}`}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={disconnect}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 h-auto"
              >
                ×
              </Button>
            </div>
          ) : !isInFarcaster ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleConnect}
              className="text-xs px-3 py-1 h-auto bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="bg-yellow-600 text-black px-3 py-1 rounded text-xs">
              No Wallet
            </div>
          )}
        </div>
      </div>

      {/* Asset Price Bar */}
      {selectedAsset && (
        <div className="px-4 py-2 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-white font-medium">{selectedAsset.symbol}</div>
                <div className="text-xs text-gray-400">Perpetual</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  ${formatPrice(selectedAsset.price)}
                </div>
                <div className={`text-xs ${
                  parseFloat(selectedAsset.change24h) >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {formatChange(selectedAsset.change24h)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">24h Vol</div>
              <div className="text-white text-sm">
                {(parseFloat(selectedAsset.volume24h) / 1e6).toFixed(1)}M
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
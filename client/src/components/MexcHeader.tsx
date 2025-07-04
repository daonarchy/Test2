import { useWallet } from "@/hooks/useWallet";
import { formatPrice, formatChange } from "@/lib/utils";
import ChainSelector from "./ChainSelector";
import type { TradingPair } from "@shared/schema";

interface MexcHeaderProps {
  selectedAsset: TradingPair | null;
}

export default function MexcHeader({ selectedAsset }: MexcHeaderProps) {
  const { isConnected, address, connect } = useWallet();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center space-x-3">
          <div className="text-yellow-400 font-bold text-lg">gTrade</div>
          <div className="text-gray-400">Futures</div>
        </div>
        <div className="flex items-center space-x-3">
          <ChainSelector />
          <button
            onClick={connect}
            className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-medium"
          >
            {isConnected 
              ? `${address?.slice(0, 4)}...${address?.slice(-4)}`
              : "Connect"
            }
          </button>
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
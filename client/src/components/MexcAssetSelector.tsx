import { useState } from "react";
import { formatPrice, formatChange } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface MexcAssetSelectorProps {
  pairs: TradingPair[];
  selectedAsset: TradingPair | null;
  onAssetSelect: (asset: TradingPair) => void;
  isLoading: boolean;
}

export default function MexcAssetSelector({ pairs, selectedAsset, onAssetSelect, isLoading }: MexcAssetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  const filteredPairs = pairs.filter(pair => 
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssetIcon = (symbol: string) => {
    const iconMap: Record<string, string> = {
      "BTC/USD": "₿",
      "ETH/USD": "Ξ",
      "BNB/USD": "BNB",
      "SOL/USD": "SOL",
      "ADA/USD": "ADA",
    };
    return iconMap[symbol] || symbol.split('/')[0].slice(0, 3);
  };

  if (showSelector) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
        <div className="bg-gray-900 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-white font-medium">Select Trading Pair</h2>
            <button
              onClick={() => setShowSelector(false)}
              className="text-gray-400 text-xl"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-yellow-400 outline-none"
            />
          </div>

          {/* Asset List */}
          <div className="flex-1 overflow-y-auto px-4">
            {filteredPairs.map((pair) => (
              <div
                key={pair.id}
                onClick={() => {
                  onAssetSelect(pair);
                  setShowSelector(false);
                }}
                className="flex items-center justify-between py-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    {getAssetIcon(pair.symbol)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{pair.symbol}</div>
                    <div className="text-gray-400 text-sm">{pair.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white">${formatPrice(pair.price)}</div>
                  <div className={`text-sm ${
                    parseFloat(pair.change24h) >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {formatChange(pair.change24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowSelector(true)}
      className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded"
    >
      {selectedAsset ? (
        <>
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
            {getAssetIcon(selectedAsset.symbol)}
          </div>
          <span className="text-white font-medium">{selectedAsset.symbol}</span>
          <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
        </>
      ) : (
        <span className="text-gray-400">Select Pair</span>
      )}
    </button>
  );
}
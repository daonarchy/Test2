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
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: 'all', name: 'All', count: pairs.length },
    { id: 'crypto', name: 'Crypto', count: pairs.filter(p => p.category === 'crypto').length },
    { id: 'forex', name: 'Forex', count: pairs.filter(p => p.category === 'forex').length },
    { id: 'stocks', name: 'Stocks', count: pairs.filter(p => p.category === 'stocks').length },
    { id: 'indices', name: 'Indices', count: pairs.filter(p => p.category === 'indices').length },
    { id: 'commodities', name: 'Commodities', count: pairs.filter(p => p.category === 'commodities').length },
  ];

  const filteredPairs = pairs.filter(pair => {
    const matchesSearch = pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pair.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pair.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

          {/* Category Tabs */}
          <div className="px-4 pb-2">
            <div className="flex space-x-1 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap ${
                    selectedCategory === category.id
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
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
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    {getAssetIcon(pair.symbol)}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{pair.symbol}</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-400 text-sm">{pair.name}</div>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                        pair.category === 'crypto' ? 'bg-orange-500/20 text-orange-300' :
                        pair.category === 'forex' ? 'bg-blue-500/20 text-blue-300' :
                        pair.category === 'stocks' ? 'bg-green-500/20 text-green-300' :
                        pair.category === 'indices' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {pair.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${formatPrice(pair.price)}</div>
                  <div className="flex items-center justify-end space-x-2">
                    <div className={`text-sm ${
                      parseFloat(pair.change24h) >= 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {formatChange(pair.change24h)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {pair.maxLeverage}x
                    </div>
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
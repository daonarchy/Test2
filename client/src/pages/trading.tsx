import { useState } from "react";
import MexcHeader from "@/components/MexcHeader";
import MexcBottomNav from "@/components/MexcBottomNav";
import MexcCompactChart from "@/components/MexcCompactChart";
import MexcTradingPanel from "@/components/MexcTradingPanel";
import MexcPositionList from "@/components/MexcPositionList";
import MexcAssetSelector from "@/components/MexcAssetSelector";
import OrderBook from "@/components/OrderBook";
import { useTradingPairs } from "@/hooks/useTradingPairs";
import type { TradingPair } from "@shared/schema";

export default function TradingPage() {
  const [selectedCategory, setSelectedCategory] = useState("crypto");
  const [selectedAsset, setSelectedAsset] = useState<TradingPair | null>(null);
  const [activeTab, setActiveTab] = useState("trade");
  const [viewMode, setViewMode] = useState<"chart" | "orderbook">("chart");

  const { data: tradingPairs = [], isLoading } = useTradingPairs(selectedCategory);

  // Set default selected asset when trading pairs load
  if (!selectedAsset && tradingPairs.length > 0) {
    setSelectedAsset(tradingPairs[0]);
  }

  const handleAssetSelect = (asset: TradingPair) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <MexcHeader selectedAsset={selectedAsset} />
      
      <main className="pt-24 pb-16 px-4 space-y-4">
        {/* Asset Selector */}
        <div className="flex items-center justify-between">
          <MexcAssetSelector
            pairs={tradingPairs}
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
            isLoading={isLoading}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("chart")}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === "chart" ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewMode("orderbook")}
              className={`px-3 py-1 rounded text-xs ${
                viewMode === "orderbook" ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              Book
            </button>
          </div>
        </div>

        {selectedAsset && (
          <>
            {/* Chart/OrderBook Section */}
            {viewMode === "chart" ? (
              <MexcCompactChart asset={selectedAsset} />
            ) : (
              <OrderBook asset={selectedAsset} />
            )}

            {/* Trading Panel */}
            <MexcTradingPanel asset={selectedAsset} />

            {/* Positions */}
            <MexcPositionList />
          </>
        )}
      </main>

      <MexcBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

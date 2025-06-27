import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import CategoryTabs from "@/components/CategoryTabs";
import TradingChart from "@/components/TradingChart";
import AssetList from "@/components/AssetList";
import TradingControls from "@/components/TradingControls";
import TradingModal from "@/components/TradingModal";
import OrderBook from "@/components/OrderBook";
import RecentTrades from "@/components/RecentTrades";
import QuickActions from "@/components/QuickActions";
import PositionTracker from "@/components/PositionTracker";
import { useTradingPairs } from "@/hooks/useTradingPairs";
import { useToast } from "@/hooks/use-toast";
import type { TradingPair } from "@shared/schema";

export default function TradingPage() {
  const [selectedCategory, setSelectedCategory] = useState("crypto");
  const [selectedAsset, setSelectedAsset] = useState<TradingPair | null>(null);
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [tradingDirection, setTradingDirection] = useState<"long" | "short">("long");
  const [viewMode, setViewMode] = useState<"chart" | "orderbook">("chart");

  const { data: tradingPairs = [], isLoading } = useTradingPairs(selectedCategory);
  const { toast } = useToast();

  // Set default selected asset when trading pairs load
  if (!selectedAsset && tradingPairs.length > 0) {
    setSelectedAsset(tradingPairs[0]);
  }

  const handleOpenTradingModal = (direction: "long" | "short") => {
    setTradingDirection(direction);
    setTradingModalOpen(true);
  };

  const handleAssetSelect = (asset: TradingPair) => {
    setSelectedAsset(asset);
  };

  const handleQuickTrade = (direction: "long" | "short", amount: number) => {
    setTradingDirection(direction);
    setTradingModalOpen(true);
    toast({
      title: "Quick Trade",
      description: `Opening ${direction} position for $${amount}`,
    });
  };

  return (
    <div className="min-h-screen trading-bg-dark text-white">
      <AppHeader />
      
      <main className="pt-20 pb-32">
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {selectedAsset && (
          <div className="px-4 py-4">
            {/* View Mode Toggle */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setViewMode("chart")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "chart"
                    ? "trading-bg-accent text-white"
                    : "trading-bg-secondary trading-text-gray"
                }`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Chart
              </button>
              <button
                onClick={() => setViewMode("orderbook")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === "orderbook"
                    ? "trading-bg-accent text-white"
                    : "trading-bg-secondary trading-text-gray"
                }`}
              >
                <i className="fas fa-list-ul mr-2"></i>
                Order Book
              </button>
            </div>

            {viewMode === "chart" ? (
              <TradingChart asset={selectedAsset} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OrderBook asset={selectedAsset} />
                <RecentTrades asset={selectedAsset} />
              </div>
            )}
          </div>
        )}
        
        {/* Quick Actions and Position Tracker */}
        <div className="px-4 space-y-4">
          {selectedAsset && (
            <QuickActions onQuickTrade={handleQuickTrade} />
          )}
          
          <PositionTracker />
        </div>
        
        <AssetList 
          pairs={tradingPairs}
          isLoading={isLoading}
          selectedAsset={selectedAsset}
          onAssetSelect={handleAssetSelect}
        />
      </main>

      <TradingControls onOpenTradingModal={handleOpenTradingModal} />
      
      {selectedAsset && (
        <TradingModal
          isOpen={tradingModalOpen}
          onClose={() => setTradingModalOpen(false)}
          asset={selectedAsset}
          direction={tradingDirection}
          onDirectionChange={setTradingDirection}
        />
      )}
    </div>
  );
}

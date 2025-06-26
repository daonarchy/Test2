import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import CategoryTabs from "@/components/CategoryTabs";
import TradingChart from "@/components/TradingChart";
import AssetList from "@/components/AssetList";
import TradingControls from "@/components/TradingControls";
import TradingModal from "@/components/TradingModal";
import { useTradingPairs } from "@/hooks/useTradingPairs";
import type { TradingPair } from "@shared/schema";

export default function TradingPage() {
  const [selectedCategory, setSelectedCategory] = useState("crypto");
  const [selectedAsset, setSelectedAsset] = useState<TradingPair | null>(null);
  const [tradingModalOpen, setTradingModalOpen] = useState(false);
  const [tradingDirection, setTradingDirection] = useState<"long" | "short">("long");

  const { data: tradingPairs = [], isLoading } = useTradingPairs(selectedCategory);

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

  return (
    <div className="min-h-screen trading-bg-dark text-white">
      <AppHeader />
      
      <main className="pt-20 pb-32">
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {selectedAsset && (
          <TradingChart asset={selectedAsset} />
        )}
        
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

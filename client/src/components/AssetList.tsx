import { formatPrice, formatChange } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { TradingPair } from "@shared/schema";

interface AssetListProps {
  pairs: TradingPair[];
  isLoading: boolean;
  selectedAsset: TradingPair | null;
  onAssetSelect: (asset: TradingPair) => void;
}

const getAssetIcon = (icon: string | null, symbol: string) => {
  if (!icon) return "fas fa-coins";
  
  // Handle specific crypto icons
  if (icon.includes("bitcoin")) return "fab fa-bitcoin";
  if (icon.includes("ethereum")) return "fab fa-ethereum";
  if (icon.includes("apple")) return "fab fa-apple";
  if (icon === "bnb") return ""; // We'll use text for BNB
  if (icon === "sol") return ""; // We'll use text for SOL
  if (icon === "ada") return ""; // We'll use text for ADA
  
  return icon;
};

const getAssetColor = (symbol: string) => {
  const colors: Record<string, string> = {
    "BTC/USD": "bg-orange-500",
    "ETH/USD": "bg-blue-500", 
    "BNB/USD": "bg-yellow-500",
    "SOL/USD": "bg-purple-500",
    "ADA/USD": "bg-teal-500",
    "AAPL/USD": "bg-gray-600",
    "TSLA/USD": "bg-red-600",
    "EUR/USD": "bg-blue-600",
    "GBP/USD": "bg-blue-700",
    "XAU/USD": "bg-yellow-600",
    "WTI/USD": "bg-gray-800",
  };
  return colors[symbol] || "bg-gray-500";
};

const getAssetText = (icon: string | null, symbol: string) => {
  if (icon === "bnb") return "BNB";
  if (icon === "sol") return "SOL";
  if (icon === "ada") return "ADA";
  if (icon === "tsla") return "TSLA";
  if (icon === "eur") return "EUR";
  if (icon === "gbp") return "GBP";
  return null;
};

export default function AssetList({ pairs, isLoading, selectedAsset, onAssetSelect }: AssetListProps) {
  if (isLoading) {
    return (
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-3">Trading Pairs</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="trading-bg-secondary rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold mb-3">Trading Pairs</h3>
      <div className="space-y-2">
        {pairs.map((pair) => {
          const isPositive = parseFloat(pair.change24h) >= 0;
          const isSelected = selectedAsset?.id === pair.id;
          const iconClass = getAssetIcon(pair.icon, pair.symbol);
          const colorClass = getAssetColor(pair.symbol);
          const textContent = getAssetText(pair.icon, pair.symbol);
          
          return (
            <div
              key={pair.id}
              onClick={() => onAssetSelect(pair)}
              className={`trading-bg-secondary rounded-xl p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                isSelected ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                    {textContent ? (
                      <span className="text-white font-bold text-sm">{textContent}</span>
                    ) : (
                      <i className={`${iconClass} text-white`}></i>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{pair.symbol}</div>
                    <div className="text-sm trading-text-gray">Max {pair.maxLeverage}x</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${formatPrice(pair.price)}</div>
                  <div className={`text-sm ${
                    isPositive ? "trading-text-success" : "trading-text-danger"
                  }`}>
                    {formatChange(pair.change24h)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

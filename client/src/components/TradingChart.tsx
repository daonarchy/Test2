import { useEffect, useRef } from "react";
import { formatPrice, formatChange, formatVolume } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface TradingChartProps {
  asset: TradingPair;
}

export default function TradingChart({ asset }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize TradingView widget
    if (chartContainerRef.current && window.TradingView) {
      new window.TradingView.widget({
        width: "100%",
        height: 400,
        symbol: asset.symbol.replace("/", ""),
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1E2028",
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: "tradingview_chart",
        hide_top_toolbar: true,
        hide_legend: true,
        save_image: false,
      });
    }
  }, [asset.symbol]);

  const isPositive = parseFloat(asset.change24h) >= 0;

  return (
    <div className="px-4 py-4">
      <div className="trading-bg-secondary rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{asset.symbol}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">${formatPrice(asset.price)}</span>
              <span className={`text-sm font-medium ${
                isPositive ? "trading-text-success" : "trading-text-danger"
              }`}>
                {formatChange(asset.change24h)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm trading-text-gray">24h Volume</div>
            <div className="text-sm font-medium">{formatVolume(asset.volume24h)}</div>
          </div>
        </div>
        
        {/* TradingView Chart */}
        <div className="h-64 trading-bg-dark rounded-lg relative">
          <div 
            id="tradingview_chart" 
            ref={chartContainerRef}
            className="w-full h-full"
          />
          
          {/* Fallback when TradingView is not available */}
          <div className="absolute inset-0 flex items-center justify-center trading-border border rounded-lg">
            <div className="text-center">
              <i className="fas fa-chart-area text-4xl trading-text-gray mb-3"></i>
              <p className="trading-text-gray">TradingView Chart</p>
              <p className="text-sm trading-text-gray mt-1">
                Chart will load when TradingView widget is available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

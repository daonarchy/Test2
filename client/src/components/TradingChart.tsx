import { useEffect, useRef } from "react";
import { formatPrice, formatChange, formatVolume } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface TradingChartProps {
  asset: TradingPair;
}

export default function TradingChart({ asset }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear previous chart
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';
    }

    // Initialize TradingView widget with proper symbol mapping
    if (chartContainerRef.current && window.TradingView) {
      const symbolMap: Record<string, string> = {
        "BTC/USD": "BTCUSD",
        "ETH/USD": "ETHUSD", 
        "BNB/USD": "BNBUSD",
        "SOL/USD": "SOLUSD",
        "ADA/USD": "ADAUSD",
        "AAPL/USD": "NASDAQ:AAPL",
        "TSLA/USD": "NASDAQ:TSLA",
        "EUR/USD": "FX:EURUSD",
        "GBP/USD": "FX:GBPUSD",
        "XAU/USD": "TVC:GOLD",
        "WTI/USD": "NYMEX:CL1!"
      };
      
      const tradingViewSymbol = symbolMap[asset.symbol] || asset.symbol.replace("/", "");
      
      new window.TradingView.widget({
        width: "100%",
        height: 300,
        symbol: tradingViewSymbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1A1D24",
        enable_publishing: false,
        allow_symbol_change: false,
        container_id: chartContainerRef.current,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: [
          "Volume@tv-basicstudies",
          "RSI@tv-basicstudies"
        ],
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          "paneProperties.background": "#1A1D24",
          "paneProperties.backgroundType": "solid"
        }
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
        <div className="h-80 trading-bg-dark rounded-lg relative overflow-hidden">
          <div 
            ref={chartContainerRef}
            className="w-full h-full"
          />
          
          {/* Fallback when TradingView is not available */}
          {!window.TradingView && (
            <div className="absolute inset-0 flex items-center justify-center trading-border border rounded-lg">
              <div className="text-center">
                <i className="fas fa-chart-area text-4xl trading-text-gray mb-3"></i>
                <p className="trading-text-gray">Professional Chart</p>
                <p className="text-sm trading-text-gray mt-1">
                  Loading advanced charting tools...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

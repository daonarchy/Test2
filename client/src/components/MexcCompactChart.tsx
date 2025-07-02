import { useEffect, useRef, useState } from "react";
import { formatPrice, formatChange } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface MexcCompactChartProps {
  asset: TradingPair;
}

export default function MexcCompactChart({ asset }: MexcCompactChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h">("5m");

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.innerHTML = '';
    }

    // Simple price movement visualization
    const createSimpleChart = () => {
      if (!chartRef.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = chartRef.current.clientWidth;
      canvas.height = 120;
      canvas.className = 'w-full h-full';
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Generate mock price data
      const points = 50;
      const basePrice = parseFloat(asset.price);
      const data: number[] = [];
      
      for (let i = 0; i < points; i++) {
        const variance = (Math.random() - 0.5) * basePrice * 0.02;
        const price = basePrice + variance;
        data.push(price);
      }

      // Draw chart
      const minPrice = Math.min(...data);
      const maxPrice = Math.max(...data);
      const priceRange = maxPrice - minPrice;

      ctx.strokeStyle = parseFloat(asset.change24h) >= 0 ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      data.forEach((price, index) => {
        const x = (index / (points - 1)) * canvas.width;
        const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, parseFloat(asset.change24h) >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradient;
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      chartRef.current.appendChild(canvas);
    };

    if (chartType === "candlestick") {
      createCandlestickChart();
    } else {
      createSimpleChart();
    }
  }, [asset, chartType, timeframe]);

  const createCandlestickChart = () => {
    if (!chartRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = chartRef.current.clientWidth;
    canvas.height = 120;
    canvas.className = 'w-full h-full';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#111827'; // Dark gray background like gTrade
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate realistic candlestick data with proper OHLC logic
    const candleCount = 20;
    const currentPrice = parseFloat(asset.price);
    const candles = [];
    let basePrice = currentPrice * 0.995; // Start slightly below current
    
    for (let i = 0; i < candleCount; i++) {
      const open = basePrice;
      const volatilityRange = currentPrice * 0.008; // Realistic volatility
      
      // Generate high and low based on open
      const high = open + Math.random() * volatilityRange;
      const low = open - Math.random() * volatilityRange;
      
      // Close price within high-low range, with trend bias
      const trendBias = (Math.random() - 0.4) * 0.6; // Slight upward bias
      const close = low + (high - low) * (0.3 + Math.random() * 0.4) + (high - low) * trendBias;
      
      candles.push({ 
        open: Math.max(low, Math.min(high, open)), 
        high, 
        low, 
        close: Math.max(low, Math.min(high, close))
      });
      
      // Next candle opens near previous close
      basePrice = close + (Math.random() - 0.5) * volatilityRange * 0.3;
    }
    
    // Ensure last candle ends at current price
    candles[candles.length - 1].close = currentPrice;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, currentPrice);
    candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, currentPrice);

    // Find price range with padding
    const allPrices = candles.flatMap(c => [c.open, c.high, c.low, c.close]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% padding
    const adjustedMin = minPrice - padding;
    const adjustedMax = maxPrice + padding;
    const adjustedRange = adjustedMax - adjustedMin;

    const candleWidth = Math.max(2, (canvas.width / candleCount) * 0.7);
    const candleSpacing = canvas.width / candleCount;

    // gTrade style colors
    const bullishColor = '#00C896'; // gTrade green
    const bearishColor = '#FF4747'; // gTrade red
    const wickColor = '#888888'; // Gray for wicks

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw candlesticks
    candles.forEach((candle, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const isBullish = candle.close >= candle.open;
      
      // Scale prices to canvas
      const openY = canvas.height - ((candle.open - adjustedMin) / adjustedRange) * canvas.height;
      const closeY = canvas.height - ((candle.close - adjustedMin) / adjustedRange) * canvas.height;
      const highY = canvas.height - ((candle.high - adjustedMin) / adjustedRange) * canvas.height;
      const lowY = canvas.height - ((candle.low - adjustedMin) / adjustedRange) * canvas.height;

      // Draw wick (thin line for high-low)
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw candle body
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (isBullish) {
        // Bullish candle - hollow/outline style like TradingView
        ctx.strokeStyle = bullishColor;
        ctx.fillStyle = '#111827'; // Same as background for hollow effect
        ctx.lineWidth = 1.5;
        
        if (bodyHeight < 1) {
          // Doji - draw thin line
          ctx.beginPath();
          ctx.moveTo(x - candleWidth / 2, openY);
          ctx.lineTo(x + candleWidth / 2, openY);
          ctx.stroke();
        } else {
          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
          ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
        }
      } else {
        // Bearish candle - filled
        ctx.fillStyle = bearishColor;
        
        if (bodyHeight < 1) {
          // Doji - draw thin line
          ctx.beginPath();
          ctx.moveTo(x - candleWidth / 2, openY);
          ctx.lineTo(x + candleWidth / 2, openY);
          ctx.strokeStyle = bearishColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
        }
      }
    });

    // Add price labels on right side (like gTrade)
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    // Show high, current, and low prices
    const currentY = canvas.height - ((currentPrice - adjustedMin) / adjustedRange) * canvas.height;
    const highestY = canvas.height - ((adjustedMax - adjustedMin) / adjustedRange) * canvas.height;
    const lowestY = canvas.height - ((adjustedMin - adjustedMin) / adjustedRange) * canvas.height;
    
    // Current price line and label
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(canvas.width - 40, currentY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Price labels with better formatting
    ctx.fillStyle = '#FBBF24';
    ctx.fillText(formatPrice(currentPrice), canvas.width - 38, currentY + 3);
    
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(formatPrice(adjustedMax), canvas.width - 38, highestY + 12);
    ctx.fillText(formatPrice(adjustedMin), canvas.width - 38, lowestY - 2);

    chartRef.current.appendChild(canvas);
  };

  const isPositive = parseFloat(asset.change24h) >= 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-white font-medium text-sm">{asset.symbol}</div>
          <div className="text-xs text-gray-400">Perpetual</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button
              onClick={() => setChartType("candlestick")}
              className={`px-2 py-1 rounded text-xs ${
                chartType === "candlestick" ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              <i className="fas fa-chart-bar"></i>
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-2 py-1 rounded text-xs ${
                chartType === "line" ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400"
              }`}
            >
              <i className="fas fa-chart-line"></i>
            </button>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">${formatPrice(asset.price)}</div>
            <div className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {formatChange(asset.change24h)}
            </div>
          </div>
        </div>
      </div>
      
      <div ref={chartRef} className="h-24 w-full"></div>
      
      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
        <div className="flex space-x-1">
          {(["1m", "5m", "15m", "1h"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded text-xs ${
                timeframe === tf ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex space-x-3">
          <span>24h Vol: {(parseFloat(asset.volume24h) / 1e6).toFixed(1)}M</span>
          <span>Max: {asset.maxLeverage}x</span>
        </div>
      </div>
    </div>
  );
}
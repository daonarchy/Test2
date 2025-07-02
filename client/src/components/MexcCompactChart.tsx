import { useEffect, useRef, useState } from "react";
import { formatPrice, formatChange } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface MexcCompactChartProps {
  asset: TradingPair;
}

export default function MexcCompactChart({ asset }: MexcCompactChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartType, setChartType] = useState<"candlestick" | "line">("candlestick");

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
  }, [asset, chartType]);

  const createCandlestickChart = () => {
    if (!chartRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = chartRef.current.clientWidth;
    canvas.height = 120;
    canvas.className = 'w-full h-full';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate candlestick data
    const candleCount = 15;
    const currentPrice = parseFloat(asset.price);
    const candles = [];
    let price = currentPrice * 0.98;
    
    for (let i = 0; i < candleCount; i++) {
      const open = price;
      const volatility = currentPrice * 0.01;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      
      candles.push({ open, high, low, close });
      price = close + (Math.random() - 0.5) * volatility * 0.5;
    }
    
    // Ensure last candle reflects current price
    candles[candles.length - 1].close = currentPrice;

    // Find price range
    const allPrices = candles.flatMap(c => [c.open, c.high, c.low, c.close]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;

    const candleWidth = (canvas.width / candleCount) * 0.6;
    const candleSpacing = canvas.width / candleCount;

    // Draw candlesticks
    candles.forEach((candle, index) => {
      const x = index * candleSpacing + candleSpacing / 2;
      const isGreen = candle.close >= candle.open;
      
      // Scale prices to canvas
      const openY = canvas.height - ((candle.open - minPrice) / priceRange) * canvas.height;
      const closeY = canvas.height - ((candle.close - minPrice) / priceRange) * canvas.height;
      const highY = canvas.height - ((candle.high - minPrice) / priceRange) * canvas.height;
      const lowY = canvas.height - ((candle.low - minPrice) / priceRange) * canvas.height;

      // Draw wick (high-low line)
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body (open-close rectangle)
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      const bodyHeight = Math.abs(closeY - openY) || 1;
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
    });

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
      
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>24h Vol: {(parseFloat(asset.volume24h) / 1e6).toFixed(1)}M</span>
        <span>Max: {asset.maxLeverage}x</span>
      </div>
    </div>
  );
}
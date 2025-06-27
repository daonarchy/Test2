import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface RecentTradesProps {
  asset: TradingPair;
}

interface Trade {
  id: string;
  price: number;
  size: number;
  time: string;
  side: "buy" | "sell";
}

export default function RecentTrades({ asset }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // Generate initial mock trades
    const generateTrades = (): Trade[] => {
      const currentPrice = parseFloat(asset.price);
      const newTrades: Trade[] = [];
      
      for (let i = 0; i < 20; i++) {
        const priceVariation = (Math.random() - 0.5) * currentPrice * 0.001;
        const trade: Trade = {
          id: Date.now().toString() + i,
          price: currentPrice + priceVariation,
          size: Math.random() * 5 + 0.1,
          time: new Date(Date.now() - i * 1000 * Math.random() * 60).toLocaleTimeString(),
          side: Math.random() > 0.5 ? "buy" : "sell"
        };
        newTrades.push(trade);
      }
      
      return newTrades.sort((a, b) => b.id.localeCompare(a.id));
    };

    setTrades(generateTrades());

    // Add new trades periodically
    const interval = setInterval(() => {
      const currentPrice = parseFloat(asset.price);
      const priceVariation = (Math.random() - 0.5) * currentPrice * 0.001;
      
      const newTrade: Trade = {
        id: Date.now().toString(),
        price: currentPrice + priceVariation,
        size: Math.random() * 5 + 0.1,
        time: new Date().toLocaleTimeString(),
        side: Math.random() > 0.5 ? "buy" : "sell"
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 19)]);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [asset.price]);

  return (
    <div className="trading-bg-secondary rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold text-white">Recent Trades</h3>
        <div className="flex justify-between text-xs trading-text-gray mt-1">
          <span>Price</span>
          <span>Size</span>
          <span>Time</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto trading-scrollbar">
        {trades.map((trade, index) => (
          <div 
            key={trade.id}
            className={`flex justify-between text-xs py-1.5 px-3 hover:bg-gray-800/50 transition-colors ${
              index === 0 ? 'bg-gray-800/30' : ''
            }`}
          >
            <span className={trade.side === "buy" ? "text-green-400" : "text-red-400"}>
              {formatPrice(trade.price)}
            </span>
            <span className="text-white">{trade.size.toFixed(4)}</span>
            <span className="trading-text-gray">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
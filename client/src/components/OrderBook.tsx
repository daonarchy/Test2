import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import type { TradingPair } from "@shared/schema";

interface OrderBookProps {
  asset: TradingPair;
}

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export default function OrderBook({ asset }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookLevel[]>([]);
  const [asks, setAsks] = useState<OrderBookLevel[]>([]);

  useEffect(() => {
    // Generate mock order book data
    const currentPrice = parseFloat(asset.price);
    const spread = currentPrice * 0.001; // 0.1% spread
    
    const generateOrderLevels = (basePrice: number, isAsk: boolean): OrderBookLevel[] => {
      const levels: OrderBookLevel[] = [];
      let total = 0;
      
      for (let i = 0; i < 10; i++) {
        const priceStep = spread * (i + 1) * 0.1;
        const price = isAsk ? basePrice + priceStep : basePrice - priceStep;
        const size = Math.random() * 10 + 1;
        total += size;
        
        levels.push({
          price,
          size,
          total
        });
      }
      
      return isAsk ? levels : levels.reverse();
    };

    const newAsks = generateOrderLevels(currentPrice, true);
    const newBids = generateOrderLevels(currentPrice, false);
    
    setAsks(newAsks);
    setBids(newBids);

    // Update every 2 seconds for realistic feel
    const interval = setInterval(() => {
      const updatedAsks = generateOrderLevels(currentPrice, true);
      const updatedBids = generateOrderLevels(currentPrice, false);
      setAsks(updatedAsks);
      setBids(updatedBids);
    }, 2000);

    return () => clearInterval(interval);
  }, [asset.price]);

  const maxVolume = Math.max(
    ...asks.map(level => level.total),
    ...bids.map(level => level.total)
  );

  const OrderLevel = ({ level, type }: { level: OrderBookLevel; type: 'bid' | 'ask' }) => {
    const widthPercentage = (level.total / maxVolume) * 100;
    
    return (
      <div className="relative flex justify-between text-xs py-1 px-2 hover:bg-gray-800/50 cursor-pointer transition-colors">
        <div 
          className={`absolute inset-0 ${
            type === 'bid' ? 'bg-green-600/20' : 'bg-red-600/20'
          }`}
          style={{ width: `${widthPercentage}%` }}
        />
        <span className={type === 'bid' ? 'text-green-400' : 'text-red-400'}>
          {formatPrice(level.price)}
        </span>
        <span className="text-white">{level.size.toFixed(4)}</span>
        <span className="trading-text-gray">{level.total.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="trading-bg-secondary rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold text-white">Order Book</h3>
        <div className="flex justify-between text-xs trading-text-gray mt-1">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto trading-scrollbar">
        {/* Asks (Sell Orders) */}
        <div className="space-y-0">
          {asks.slice().reverse().map((level, index) => (
            <OrderLevel key={`ask-${index}`} level={level} type="ask" />
          ))}
        </div>
        
        {/* Spread */}
        <div className="py-2 px-2 border-y border-gray-700 trading-bg-dark">
          <div className="flex justify-between items-center text-xs">
            <span className="trading-text-gray">Spread</span>
            <span className="text-white font-medium">
              ${(asks[0]?.price - bids[0]?.price || 0).toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Bids (Buy Orders) */}
        <div className="space-y-0">
          {bids.map((level, index) => (
            <OrderLevel key={`bid-${index}`} level={level} type="bid" />
          ))}
        </div>
      </div>
    </div>
  );
}
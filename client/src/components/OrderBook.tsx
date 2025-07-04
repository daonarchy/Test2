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
  // Simplified mock data for better performance
  const generateLevels = (basePrice: number, count: number = 5): OrderBookLevel[] => {
    return Array.from({ length: count }, (_, i) => ({
      price: basePrice * (1 + (Math.random() - 0.5) * 0.01),
      size: Math.random() * 10 + 1,
      total: Math.random() * 100 + 10
    }));
  };

  const basePrice = parseFloat(asset.price);
  const bids = generateLevels(basePrice * 0.999);
  const asks = generateLevels(basePrice * 1.001);

  const OrderLevel = ({ level, type }: { level: OrderBookLevel; type: 'bid' | 'ask' }) => (
    <div className={`flex justify-between text-xs py-1 ${type === 'bid' ? 'text-green-400' : 'text-red-400'}`}>
      <span>${formatPrice(level.price.toString())}</span>
      <span>{level.size.toFixed(2)}</span>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-lg p-3">
      <h3 className="text-white text-sm font-medium mb-3">Order Book</h3>
      
      <div className="space-y-1">
        <div className="text-xs text-gray-400 flex justify-between">
          <span>Price</span>
          <span>Size</span>
        </div>
        
        {asks.reverse().map((ask, i) => (
          <OrderLevel key={`ask-${i}`} level={ask} type="ask" />
        ))}
        
        <div className="border-t border-gray-700 my-2"></div>
        
        {bids.map((bid, i) => (
          <OrderLevel key={`bid-${i}`} level={bid} type="bid" />
        ))}
      </div>
    </div>
  );
}
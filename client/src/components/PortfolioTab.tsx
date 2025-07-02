import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
}

interface Order {
  id: string;
  symbol: string;
  side: "long" | "short";
  type: "market" | "limit";
  size: number;
  price: number;
  leverage: number;
  status: "pending" | "filled" | "cancelled";
  timestamp: string;
}

export default function PortfolioTab() {
  const [activeTab, setActiveTab] = useState<"positions" | "orders">("positions");

  const mockPositions: Position[] = [
    {
      id: "1",
      symbol: "BTC/USD",
      side: "long",
      size: 0.25,
      entryPrice: 43180.00,
      currentPrice: 43250.00,
      leverage: 20,
      pnl: 175.00,
      pnlPercent: 4.05,
      margin: 1079.50
    },
    {
      id: "2",
      symbol: "ETH/USD",
      side: "short",
      size: 2.0,
      entryPrice: 2665.00,
      currentPrice: 2650.00,
      leverage: 10,
      pnl: 150.00,
      pnlPercent: 2.82,
      margin: 1064.00
    }
  ];

  const mockOrders: Order[] = [
    {
      id: "1",
      symbol: "SOL/USD",
      side: "long",
      type: "limit",
      size: 10,
      price: 148.50,
      leverage: 15,
      status: "pending",
      timestamp: "2025-01-02 10:25"
    },
    {
      id: "2",
      symbol: "AVAX/USD",
      side: "short",
      type: "limit",
      size: 50,
      price: 17.80,
      leverage: 10,
      status: "pending",
      timestamp: "2025-01-02 09:45"
    }
  ];

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
        
        {/* Tab Selector */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab("positions")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "positions"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Positions ({mockPositions.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Orders ({mockOrders.length})
          </button>
        </div>

        {/* Positions Tab */}
        {activeTab === "positions" && (
          <div className="space-y-3">
            {mockPositions.length > 0 ? (
              mockPositions.map((position) => (
                <div key={position.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{position.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        position.side === "long" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                        {position.side.toUpperCase()}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {position.leverage}x
                      </span>
                    </div>
                    <button className="text-red-400 text-sm hover:text-red-300">
                      Close
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs">Size</div>
                      <div className="text-white">{position.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Entry</div>
                      <div className="text-white">${formatPrice(position.entryPrice)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Current</div>
                      <div className="text-white">${formatPrice(position.currentPrice)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                    <div>
                      <div className="text-gray-400 text-xs">P&L</div>
                      <div className={`font-medium ${position.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">Margin</div>
                      <div className="text-white">${position.margin.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-chart-line text-3xl mb-2"></i>
                <p>No open positions</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {mockOrders.length > 0 ? (
              mockOrders.map((order) => (
                <div key={order.id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{order.symbol}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.side === "long" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                        {order.side.toUpperCase()}
                      </span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {order.type.toUpperCase()}
                      </span>
                    </div>
                    <button className="text-red-400 text-sm hover:text-red-300">
                      Cancel
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400 text-xs">Size</div>
                      <div className="text-white">{order.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Price</div>
                      <div className="text-white">${formatPrice(order.price)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs">Leverage</div>
                      <div className="text-white">{order.leverage}x</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                    <div>
                      <div className="text-gray-400 text-xs">Status</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        order.status === "pending" ? "bg-yellow-600 text-white" :
                        order.status === "filled" ? "bg-green-600 text-white" :
                        "bg-gray-600 text-white"
                      }`}>
                        {order.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">Time</div>
                      <div className="text-white text-xs">{order.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-clipboard-list text-3xl mb-2"></i>
                <p>No pending orders</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
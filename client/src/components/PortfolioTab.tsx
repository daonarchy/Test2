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
  const [activeTab, setActiveTab] = useState<"dashboard" | "rewards" | "credits">("dashboard");
  const [positionTab, setPositionTab] = useState<"positions" | "orders">("positions");

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
    }
  ];

  const weeklyVolume = 125000;
  const estimatedReward = 45.8;
  const claimableReward = 23.4;
  const totalCredit = 5000;
  const usedCredit = 2750;
  const availableCredit = totalCredit - usedCredit;

  return (
    <div className="bg-black text-white p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
        
        {/* Main Tab Selector */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "rewards"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Rewards
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "credits"
                ? "bg-yellow-500 text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Credits
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Position/Order Sub-tabs */}
            <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
              <button
                onClick={() => setPositionTab("positions")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  positionTab === "positions"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Positions ({mockPositions.length})
              </button>
              <button
                onClick={() => setPositionTab("orders")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  positionTab === "orders"
                    ? "bg-yellow-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Orders ({mockOrders.length})
              </button>
            </div>

            {/* Positions List */}
            {positionTab === "positions" && (
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

            {/* Orders List */}
            {positionTab === "orders" && (
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
          </>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-chart-bar text-yellow-400 mr-2"></i>
                Weekly Trading Volume
              </h3>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                ${weeklyVolume.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Current week trading volume
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-coins text-green-400 mr-2"></i>
                Estimated Weekly Reward
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {estimatedReward} $GNS
                  </div>
                  <div className="text-sm text-gray-400">
                    Based on current volume
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">USD Value</div>
                  <div className="text-white font-medium">
                    ~${(estimatedReward * 2.34).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-gift text-purple-400 mr-2"></i>
                Claimable Rewards
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-purple-400">
                    {claimableReward} $GNS
                  </div>
                  <div className="text-sm text-gray-400">
                    Ready to claim
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center">
                <i className="fas fa-hand-holding-usd mr-2"></i>
                Claim Rewards
              </button>
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === "credits" && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <i className="fas fa-credit-card text-blue-400 mr-2"></i>
                Total Credit Balance
              </h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                ${totalCredit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Available for trading positions
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Credit Usage</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Used</span>
                  <span className="text-white">{((usedCredit / totalCredit) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(usedCredit / totalCredit) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Used Credit</div>
                  <div className="text-red-400 font-bold text-lg">
                    ${usedCredit.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Available</div>
                  <div className="text-green-400 font-bold text-lg">
                    ${availableCredit.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center">
                <i className="fas fa-shopping-cart mr-2"></i>
                Buy More Credit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
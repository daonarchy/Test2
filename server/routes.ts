import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertTradingPairSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Trading pairs endpoints - menggunakan data real Gains Network
  app.get("/api/trading-pairs", async (req, res) => {
    try {
      const { category } = req.query;
      
      // Data lengkap dari Gains Network dengan collateral yang benar (USDC, BtcUSD)
      const allPairs = [
        // Crypto pairs dengan USDC dan BtcUSD collateral
        { id: 0, symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', price: '97524.50', change24h: '2.34', volume24h: '28590000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 0, isActive: true, icon: 'btc', collaterals: ['USDC', 'BtcUSD'] },
        { id: 1, symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', price: '3423.80', change24h: '1.87', volume24h: '15430000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 1, isActive: true, icon: 'eth', collaterals: ['USDC', 'BtcUSD'] },
        { id: 2, symbol: 'LINK/USD', name: 'Chainlink', category: 'crypto', price: '24.56', change24h: '3.21', volume24h: '850000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 2, isActive: true, icon: 'link', collaterals: ['USDC', 'BtcUSD'] },
        { id: 3, symbol: 'DOGE/USD', name: 'Dogecoin', category: 'crypto', price: '0.3654', change24h: '5.67', volume24h: '2100000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 3, isActive: true, icon: 'doge', collaterals: ['USDC', 'BtcUSD'] },
        { id: 4, symbol: 'UNI/USD', name: 'Uniswap', category: 'crypto', price: '12.45', change24h: '3.67', volume24h: '456000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 4, isActive: true, icon: 'uni', collaterals: ['USDC', 'BtcUSD'] },
        { id: 5, symbol: 'ADA/USD', name: 'Cardano', category: 'crypto', price: '0.8943', change24h: '1.23', volume24h: '650000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 5, isActive: true, icon: 'ada', collaterals: ['USDC', 'BtcUSD'] },
        { id: 6, symbol: 'LTC/USD', name: 'Litecoin', category: 'crypto', price: '123.45', change24h: '1.89', volume24h: '234000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 6, isActive: true, icon: 'ltc', collaterals: ['USDC', 'BtcUSD'] },
        { id: 7, symbol: 'AAVE/USD', name: 'Aave', category: 'crypto', price: '324.56', change24h: '2.11', volume24h: '180000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 7, isActive: true, icon: 'aave', collaterals: ['USDC', 'BtcUSD'] },
        { id: 11, symbol: 'ATOM/USD', name: 'Cosmos', category: 'crypto', price: '8.67', change24h: '2.34', volume24h: '167000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 11, isActive: true, icon: 'atom', collaterals: ['USDC', 'BtcUSD'] },
        { id: 13, symbol: 'MATIC/USD', name: 'Polygon', category: 'crypto', price: '1.23', change24h: '4.56', volume24h: '345000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 13, isActive: true, icon: 'matic', collaterals: ['USDC', 'BtcUSD'] },
        { id: 15, symbol: 'DOT/USD', name: 'Polkadot', category: 'crypto', price: '7.89', change24h: '1.45', volume24h: '198000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 15, isActive: true, icon: 'dot', collaterals: ['USDC', 'BtcUSD'] },
        { id: 17, symbol: 'FTM/USD', name: 'Fantom', category: 'crypto', price: '0.456', change24h: '5.67', volume24h: '123000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 17, isActive: true, icon: 'ftm', collaterals: ['USDC', 'BtcUSD'] },
        { id: 19, symbol: 'ALGO/USD', name: 'Algorand', category: 'crypto', price: '0.234', change24h: '2.78', volume24h: '89000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 19, isActive: true, icon: 'algo', collaterals: ['USDC', 'BtcUSD'] },
        { id: 33, symbol: 'SOL/USD', name: 'Solana', category: 'crypto', price: '234.78', change24h: '4.56', volume24h: '1200000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 33, isActive: true, icon: 'sol', collaterals: ['USDC', 'BtcUSD'] },
        { id: 47, symbol: 'BNB/USD', name: 'BNB', category: 'crypto', price: '712.34', change24h: '1.89', volume24h: '580000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 47, isActive: true, icon: 'bnb', collaterals: ['USDC', 'BtcUSD'] },
        { id: 55, symbol: 'APE/USD', name: 'ApeCoin', category: 'crypto', price: '1.23', change24h: '6.78', volume24h: '89000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 55, isActive: true, icon: 'ape', collaterals: ['USDC', 'BtcUSD'] },
        { id: 57, symbol: 'SHIB/USD', name: 'Shiba Inu', category: 'crypto', price: '0.00002456', change24h: '12.34', volume24h: '780000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 57, isActive: true, icon: 'shib', collaterals: ['USDC', 'BtcUSD'] },
        { id: 102, symbol: 'AVAX/USD', name: 'Avalanche', category: 'crypto', price: '42.56', change24h: '3.45', volume24h: '320000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 102, isActive: true, icon: 'avax', collaterals: ['USDC', 'BtcUSD'] },
        { id: 109, symbol: 'ARB/USD', name: 'Arbitrum', category: 'crypto', price: '0.8765', change24h: '2.34', volume24h: '145000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 109, isActive: true, icon: 'arb', collaterals: ['USDC', 'BtcUSD'] },
        { id: 134, symbol: 'PEPE/USD', name: 'Pepe', category: 'crypto', price: '0.000021', change24h: '15.67', volume24h: '890000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 134, isActive: true, icon: 'pepe', collaterals: ['USDC', 'BtcUSD'] },
        { id: 205, symbol: 'WIF/USD', name: 'Dogwifhat', category: 'crypto', price: '2.34', change24h: '8.90', volume24h: '67000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 205, isActive: true, icon: 'wif', collaterals: ['USDC', 'BtcUSD'] },
        { id: 301, symbol: 'PNUT/USD', name: 'Peanut the Squirrel', category: 'crypto', price: '1.567', change24h: '23.45', volume24h: '123000000', maxLeverage: 150, minPositionSize: '10', spreadP: '0.05', pairIndex: 301, isActive: true, icon: 'pnut', collaterals: ['USDC', 'BtcUSD'] },

        // Forex pairs
        { id: 21, symbol: 'EUR/USD', name: 'Euro Dollar', category: 'forex', price: '1.0456', change24h: '-0.23', volume24h: '87650000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 21, isActive: true, icon: 'eur', collaterals: ['USDC', 'BtcUSD'] },
        { id: 22, symbol: 'USD/JPY', name: 'Dollar Yen', category: 'forex', price: '149.56', change24h: '0.45', volume24h: '56780000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 22, isActive: true, icon: 'jpy', collaterals: ['USDC', 'BtcUSD'] },
        { id: 23, symbol: 'GBP/USD', name: 'Pound Dollar', category: 'forex', price: '1.2789', change24h: '0.12', volume24h: '45670000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 23, isActive: true, icon: 'gbp', collaterals: ['USDC', 'BtcUSD'] },
        { id: 24, symbol: 'AUD/USD', name: 'Australian Dollar', category: 'forex', price: '0.6789', change24h: '0.56', volume24h: '19870000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 24, isActive: true, icon: 'aud', collaterals: ['USDC', 'BtcUSD'] },
        { id: 25, symbol: 'USD/CHF', name: 'Dollar Swiss Franc', category: 'forex', price: '0.8934', change24h: '-0.12', volume24h: '15670000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 25, isActive: true, icon: 'chf', collaterals: ['USDC', 'BtcUSD'] },
        { id: 26, symbol: 'USD/CAD', name: 'Dollar Canadian', category: 'forex', price: '1.3456', change24h: '-0.34', volume24h: '23450000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 26, isActive: true, icon: 'cad', collaterals: ['USDC', 'BtcUSD'] },
        { id: 27, symbol: 'NZD/USD', name: 'New Zealand Dollar', category: 'forex', price: '0.6123', change24h: '0.78', volume24h: '8760000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 27, isActive: true, icon: 'nzd', collaterals: ['USDC', 'BtcUSD'] },
        { id: 28, symbol: 'GBP/JPY', name: 'Pound Yen', category: 'forex', price: '191.23', change24h: '0.45', volume24h: '12340000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 28, isActive: true, icon: 'gbp', collaterals: ['USDC', 'BtcUSD'] },
        { id: 29, symbol: 'EUR/JPY', name: 'Euro Yen', category: 'forex', price: '156.78', change24h: '0.23', volume24h: '34560000000', maxLeverage: 1000, minPositionSize: '10', spreadP: '0.01', pairIndex: 29, isActive: true, icon: 'eur', collaterals: ['USDC', 'BtcUSD'] },

        // Stocks
        { id: 58, symbol: 'AAPL/USD', name: 'Apple Inc', category: 'stocks', price: '234.56', change24h: '1.23', volume24h: '12340000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 58, isActive: true, icon: 'aapl', collaterals: ['USDC', 'BtcUSD'] },
        { id: 59, symbol: 'NFLX/USD', name: 'Netflix', category: 'stocks', price: '567.89', change24h: '2.45', volume24h: '3450000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 59, isActive: true, icon: 'nflx', collaterals: ['USDC', 'BtcUSD'] },
        { id: 60, symbol: 'COIN/USD', name: 'Coinbase', category: 'stocks', price: '187.45', change24h: '5.67', volume24h: '2340000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 60, isActive: true, icon: 'coin', collaterals: ['USDC', 'BtcUSD'] },
        { id: 61, symbol: 'AMD/USD', name: 'Advanced Micro Devices', category: 'stocks', price: '145.67', change24h: '3.12', volume24h: '5670000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 61, isActive: true, icon: 'amd', collaterals: ['USDC', 'BtcUSD'] },
        { id: 62, symbol: 'MSFT/USD', name: 'Microsoft', category: 'stocks', price: '456.78', change24h: '0.89', volume24h: '8760000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 62, isActive: true, icon: 'msft', collaterals: ['USDC', 'BtcUSD'] },
        { id: 63, symbol: 'UBER/USD', name: 'Uber Technologies', category: 'stocks', price: '67.89', change24h: '2.34', volume24h: '1890000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 63, isActive: true, icon: 'uber', collaterals: ['USDC', 'BtcUSD'] },
        { id: 64, symbol: 'PYPL/USD', name: 'PayPal', category: 'stocks', price: '89.45', change24h: '-1.23', volume24h: '2340000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 64, isActive: true, icon: 'pypl', collaterals: ['USDC', 'BtcUSD'] },
        { id: 65, symbol: 'NVDA/USD', name: 'NVIDIA', category: 'stocks', price: '876.54', change24h: '3.45', volume24h: '15670000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 65, isActive: true, icon: 'nvda', collaterals: ['USDC', 'BtcUSD'] },
        { id: 81, symbol: 'META/USD', name: 'Meta Platforms', category: 'stocks', price: '567.89', change24h: '2.11', volume24h: '9870000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 81, isActive: true, icon: 'meta', collaterals: ['USDC', 'BtcUSD'] },
        { id: 82, symbol: 'GOOGL/USD', name: 'Alphabet Inc', category: 'stocks', price: '178.90', change24h: '1.67', volume24h: '6540000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 82, isActive: true, icon: 'googl', collaterals: ['USDC', 'BtcUSD'] },
        { id: 84, symbol: 'AMZN/USD', name: 'Amazon', category: 'stocks', price: '198.76', change24h: '0.98', volume24h: '7890000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 84, isActive: true, icon: 'amzn', collaterals: ['USDC', 'BtcUSD'] },
        { id: 85, symbol: 'TSLA/USD', name: 'Tesla Inc', category: 'stocks', price: '432.10', change24h: '4.56', volume24h: '11230000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 85, isActive: true, icon: 'tsla', collaterals: ['USDC', 'BtcUSD'] },
        { id: 378, symbol: 'MSTR/USD', name: 'MicroStrategy', category: 'stocks', price: '567.43', change24h: '8.90', volume24h: '2340000000', maxLeverage: 25, minPositionSize: '10', spreadP: '0.1', pairIndex: 378, isActive: true, icon: 'mstr', collaterals: ['USDC', 'BtcUSD'] },

        // Indices
        { id: 86, symbol: 'SPY/USD', name: 'S&P 500 ETF', category: 'indices', price: '567.89', change24h: '0.78', volume24h: '23450000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.05', pairIndex: 86, isActive: true, icon: 'spy', collaterals: ['USDC', 'BtcUSD'] },
        { id: 87, symbol: 'QQQ/USD', name: 'Nasdaq 100 ETF', category: 'indices', price: '487.65', change24h: '1.23', volume24h: '18760000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.05', pairIndex: 87, isActive: true, icon: 'qqq', collaterals: ['USDC', 'BtcUSD'] },
        { id: 88, symbol: 'IWM/USD', name: 'Russell 2000 ETF', category: 'indices', price: '234.56', change24h: '0.45', volume24h: '8760000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.05', pairIndex: 88, isActive: true, icon: 'iwm', collaterals: ['USDC', 'BtcUSD'] },
        { id: 89, symbol: 'DIA/USD', name: 'Dow Jones ETF', category: 'indices', price: '456.78', change24h: '0.67', volume24h: '6540000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.05', pairIndex: 89, isActive: true, icon: 'dia', collaterals: ['USDC', 'BtcUSD'] },

        // Commodities
        { id: 90, symbol: 'XAU/USD', name: 'Gold', category: 'commodities', price: '2678.90', change24h: '0.89', volume24h: '12340000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.01', pairIndex: 90, isActive: true, icon: 'xau', collaterals: ['USDC', 'BtcUSD'] },
        { id: 91, symbol: 'XAG/USD', name: 'Silver', category: 'commodities', price: '31.45', change24h: '1.23', volume24h: '3450000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.04', pairIndex: 91, isActive: true, icon: 'xag', collaterals: ['USDC', 'BtcUSD'] },
        { id: 187, symbol: 'WTI/USD', name: 'WTI Crude Oil', category: 'commodities', price: '78.90', change24h: '2.34', volume24h: '8760000000', maxLeverage: 250, minPositionSize: '10', spreadP: '0.04', pairIndex: 187, isActive: true, icon: 'wti', collaterals: ['USDC', 'BtcUSD'] },
      ];
      
      let pairs;
      if (category && typeof category === "string") {
        pairs = allPairs.filter(pair => pair.category === category);
      } else {
        pairs = allPairs;
      }
      
      res.json(pairs);
    } catch (error) {
      console.error("Error fetching trading pairs:", error);
      res.status(500).json({ message: "Failed to fetch trading pairs" });
    }
  });

  app.get("/api/trading-pairs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pair = await storage.getTradingPair(id);
      
      if (!pair) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      
      res.json(pair);
    } catch (error) {
      console.error("Error fetching trading pair:", error);
      res.status(500).json({ message: "Failed to fetch trading pair" });
    }
  });

  app.get("/api/trading-pairs/symbol/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol;
      const pair = await storage.getTradingPairBySymbol(symbol);
      
      if (!pair) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      
      res.json(pair);
    } catch (error) {
      console.error("Error fetching trading pair:", error);
      res.status(500).json({ message: "Failed to fetch trading pair" });
    }
  });

  // Update trading pair price (for real-time updates)
  app.patch("/api/trading-pairs/:id/price", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { price, change24h } = req.body;
      
      if (!price || change24h === undefined) {
        return res.status(400).json({ message: "Price and change24h are required" });
      }
      
      const updatedPair = await storage.updateTradingPairPrice(id, price, change24h);
      
      if (!updatedPair) {
        return res.status(404).json({ message: "Trading pair not found" });
      }
      
      res.json(updatedPair);
    } catch (error) {
      console.error("Error updating trading pair price:", error);
      res.status(500).json({ message: "Failed to update trading pair price" });
    }
  });

  // Order endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Validate trading pair exists
      const pair = await storage.getTradingPair(orderData.pairId);
      if (!pair) {
        return res.status(400).json({ message: "Invalid trading pair" });
      }
      
      // Calculate margin required and liquidation price
      const entryPrice = parseFloat(orderData.entryPrice || pair.price);
      const size = parseFloat(orderData.size);
      const leverage = orderData.leverage;
      
      const marginRequired = (size * entryPrice) / leverage;
      
      // Calculate liquidation price based on direction
      const liquidationMultiplier = orderData.direction === "long" ? 
        (1 - (1 / leverage)) : (1 + (1 / leverage));
      const liquidationPrice = entryPrice * liquidationMultiplier;
      
      const orderWithCalculations = {
        ...orderData,
        entryPrice: orderData.entryPrice || pair.price,
        marginRequired: marginRequired.toFixed(8),
        liquidationPrice: liquidationPrice.toFixed(8),
      };
      
      const order = await storage.createOrder(orderWithCalculations);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Position endpoints
  app.get("/api/users/:userId/positions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const positions = await storage.getUserPositions(userId);
      res.json(positions);
    } catch (error) {
      console.error("Error fetching user positions:", error);
      res.status(500).json({ message: "Failed to fetch user positions" });
    }
  });

  app.get("/api/positions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const position = await storage.getPosition(id);
      
      if (!position) {
        return res.status(404).json({ message: "Position not found" });
      }
      
      res.json(position);
    } catch (error) {
      console.error("Error fetching position:", error);
      res.status(500).json({ message: "Failed to fetch position" });
    }
  });

  // Simulate real-time price updates endpoint
  app.get("/api/market-data/stream", async (req, res) => {
    try {
      // Get all trading pairs with simulated price movements
      const pairs = await storage.getAllTradingPairs();
      const updatedPairs = [];
      
      for (const pair of pairs) {
        // Simulate small price movements (-0.5% to +0.5%)
        const currentPrice = parseFloat(pair.price);
        const fluctuation = (Math.random() - 0.5) * 0.01; // ±0.5% change
        const newPrice = currentPrice * (1 + fluctuation);
        
        // Update change based on price movement
        const currentChange = parseFloat(pair.change24h);
        const newChange = currentChange + (fluctuation * 100);
        
        const updatedPair = await storage.updateTradingPairPrice(
          pair.id, 
          newPrice.toFixed(8), 
          newChange.toFixed(4)
        );
        
        if (updatedPair) {
          updatedPairs.push(updatedPair);
        }
      }
      
      res.json(updatedPairs);
    } catch (error) {
      console.error("Error streaming market data:", error);
      res.status(500).json({ message: "Failed to stream market data" });
    }
  });

  // Execute trade endpoint (simulates blockchain interaction)
  app.post("/api/execute-trade", async (req, res) => {
    try {
      const { orderId, signature } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Simulate blockchain transaction validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status to filled
      const filledOrder = await storage.updateOrderStatus(orderId, "filled");
      
      // Create position for filled order
      if (filledOrder && order.type === "market") {
        const pair = await storage.getTradingPair(order.pairId);
        const currentPrice = pair ? pair.price : order.entryPrice || "0";
        
        const position = await storage.createPosition({
          userId: order.userId,
          orderId: order.id,
          pairId: order.pairId,
          direction: order.direction,
          size: order.size,
          leverage: order.leverage,
          entryPrice: order.entryPrice || currentPrice,
          currentPrice,
          marginUsed: order.marginRequired,
          liquidationPrice: order.liquidationPrice || "0",
          takeProfit: order.takeProfit,
          stopLoss: order.stopLoss,
        });
        
        res.json({ 
          success: true, 
          order: filledOrder, 
          position,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}` // Mock transaction hash
        });
      } else {
        res.json({ 
          success: true, 
          order: filledOrder,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}` // Mock transaction hash
        });
      }
    } catch (error) {
      console.error("Error executing trade:", error);
      res.status(500).json({ message: "Failed to execute trade" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

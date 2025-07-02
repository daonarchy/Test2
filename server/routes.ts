import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertTradingPairSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Trading pairs endpoints - menggunakan data real dari Gains Network SDK
  app.get("/api/trading-pairs", async (req, res) => {
    try {
      const { category } = req.query;
      
      // Import and use real Gains SDK
      const { gainsSDK } = await import('../client/src/lib/gainsSDK.js');
      
      // Fetch real trading pairs from SDK
      console.log('Fetching trading pairs from Gains Network SDK...');
      const allPairs = await gainsSDK.getMarkets();
      
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

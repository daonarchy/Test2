import { users, tradingPairs, orders, positions, type User, type InsertUser, type TradingPair, type InsertTradingPair, type Order, type InsertOrder, type Position, type InsertPosition } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trading pair methods
  getAllTradingPairs(): Promise<TradingPair[]>;
  getTradingPairsByCategory(category: string): Promise<TradingPair[]>;
  getTradingPair(id: number): Promise<TradingPair | undefined>;
  getTradingPairBySymbol(symbol: string): Promise<TradingPair | undefined>;
  createTradingPair(pair: InsertTradingPair): Promise<TradingPair>;
  updateTradingPairPrice(id: number, price: string, change24h: string): Promise<TradingPair | undefined>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Position methods
  createPosition(position: InsertPosition): Promise<Position>;
  getPosition(id: number): Promise<Position | undefined>;
  getUserPositions(userId: number): Promise<Position[]>;
  updatePosition(id: number, currentPrice: string, pnl: string): Promise<Position | undefined>;
  closePosition(id: number): Promise<Position | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tradingPairs: Map<number, TradingPair>;
  private orders: Map<number, Order>;
  private positions: Map<number, Position>;
  private currentUserId: number;
  private currentPairId: number;
  private currentOrderId: number;
  private currentPositionId: number;

  constructor() {
    this.users = new Map();
    this.tradingPairs = new Map();
    this.orders = new Map();
    this.positions = new Map();
    this.currentUserId = 1;
    this.currentPairId = 1;
    this.currentOrderId = 1;
    this.currentPositionId = 1;

    // Initialize with some trading pairs
    this.initializeTradingPairs();
  }

  private async initializeTradingPairs() {
    const initialPairs: InsertTradingPair[] = [
      {
        symbol: "BTC/USD",
        name: "Bitcoin",
        category: "crypto",
        price: "43250.00",
        change24h: "2.45",
        volume24h: "1200000000.00",
        maxLeverage: 1000,
        icon: "fab fa-bitcoin",
      },
      {
        symbol: "ETH/USD", 
        name: "Ethereum",
        category: "crypto",
        price: "2650.00",
        change24h: "-1.23",
        volume24h: "800000000.00",
        maxLeverage: 1000,
        icon: "fab fa-ethereum",
      },
      {
        symbol: "BNB/USD",
        name: "BNB",
        category: "crypto", 
        price: "245.80",
        change24h: "0.85",
        volume24h: "150000000.00",
        maxLeverage: 500,
        icon: "bnb",
      },
      {
        symbol: "SOL/USD",
        name: "Solana",
        category: "crypto",
        price: "98.50", 
        change24h: "3.12",
        volume24h: "300000000.00",
        maxLeverage: 750,
        icon: "sol",
      },
      {
        symbol: "ADA/USD",
        name: "Cardano",
        category: "crypto",
        price: "0.485",
        change24h: "-2.14", 
        volume24h: "50000000.00",
        maxLeverage: 300,
        icon: "ada",
      },
      {
        symbol: "AAPL/USD",
        name: "Apple Inc",
        category: "stocks",
        price: "182.50",
        change24h: "1.25",
        volume24h: "75000000.00",
        maxLeverage: 20,
        icon: "fab fa-apple",
      },
      {
        symbol: "TSLA/USD",
        name: "Tesla Inc",
        category: "stocks", 
        price: "248.75",
        change24h: "-0.95",
        volume24h: "120000000.00",
        maxLeverage: 20,
        icon: "tsla",
      },
      {
        symbol: "EUR/USD",
        name: "Euro/US Dollar",
        category: "forex",
        price: "1.0856",
        change24h: "0.12",
        volume24h: "5000000000.00",
        maxLeverage: 500,
        icon: "eur",
      },
      {
        symbol: "GBP/USD", 
        name: "British Pound/US Dollar",
        category: "forex",
        price: "1.2534",
        change24h: "-0.08",
        volume24h: "3000000000.00", 
        maxLeverage: 500,
        icon: "gbp",
      },
      {
        symbol: "XAU/USD",
        name: "Gold",
        category: "commodities",
        price: "2015.50",
        change24h: "1.85",
        volume24h: "2000000000.00",
        maxLeverage: 200,
        icon: "fas fa-coins",
      },
      {
        symbol: "WTI/USD",
        name: "Crude Oil",
        category: "commodities",
        price: "72.80",
        change24h: "-0.45",
        volume24h: "1500000000.00",
        maxLeverage: 100,
        icon: "fas fa-oil-well",
      },
    ];

    for (const pair of initialPairs) {
      await this.createTradingPair(pair);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Trading pair methods
  async getAllTradingPairs(): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values()).filter(pair => pair.isActive);
  }

  async getTradingPairsByCategory(category: string): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values()).filter(
      pair => pair.category === category && pair.isActive
    );
  }

  async getTradingPair(id: number): Promise<TradingPair | undefined> {
    return this.tradingPairs.get(id);
  }

  async getTradingPairBySymbol(symbol: string): Promise<TradingPair | undefined> {
    return Array.from(this.tradingPairs.values()).find(pair => pair.symbol === symbol);
  }

  async createTradingPair(insertPair: InsertTradingPair): Promise<TradingPair> {
    const id = this.currentPairId++;
    const pair: TradingPair = {
      ...insertPair,
      id,
      isActive: true,
      updatedAt: new Date(),
    };
    this.tradingPairs.set(id, pair);
    return pair;
  }

  async updateTradingPairPrice(id: number, price: string, change24h: string): Promise<TradingPair | undefined> {
    const pair = this.tradingPairs.get(id);
    if (pair) {
      const updatedPair = { ...pair, price, change24h, updatedAt: new Date() };
      this.tradingPairs.set(id, updatedPair);
      return updatedPair;
    }
    return undefined;
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Position methods
  async createPosition(insertPosition: InsertPosition): Promise<Position> {
    const id = this.currentPositionId++;
    const position: Position = {
      ...insertPosition,
      id,
      pnl: "0",
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.positions.set(id, position);
    return position;
  }

  async getPosition(id: number): Promise<Position | undefined> {
    return this.positions.get(id);
  }

  async getUserPositions(userId: number): Promise<Position[]> {
    return Array.from(this.positions.values()).filter(position => position.userId === userId);
  }

  async updatePosition(id: number, currentPrice: string, pnl: string): Promise<Position | undefined> {
    const position = this.positions.get(id);
    if (position) {
      const updatedPosition = { ...position, currentPrice, pnl, updatedAt: new Date() };
      this.positions.set(id, updatedPosition);
      return updatedPosition;
    }
    return undefined;
  }

  async closePosition(id: number): Promise<Position | undefined> {
    const position = this.positions.get(id);
    if (position) {
      const closedPosition = { ...position, status: "closed", updatedAt: new Date() };
      this.positions.set(id, closedPosition);
      return closedPosition;
    }
    return undefined;
  }
}

export const storage = new MemStorage();

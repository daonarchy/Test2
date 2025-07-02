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
      // Major Cryptocurrencies
      { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', price: '97524.50', change24h: '2.34', volume24h: '28590000000', maxLeverage: 150, icon: 'btc' },
      { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', price: '3423.80', change24h: '1.87', volume24h: '15430000000', maxLeverage: 150, icon: 'eth' },
      { symbol: 'LINK/USD', name: 'Chainlink', category: 'crypto', price: '24.56', change24h: '3.21', volume24h: '850000000', maxLeverage: 150, icon: 'link' },
      { symbol: 'DOGE/USD', name: 'Dogecoin', category: 'crypto', price: '0.3654', change24h: '5.67', volume24h: '2100000000', maxLeverage: 150, icon: 'doge' },
      { symbol: 'ADA/USD', name: 'Cardano', category: 'crypto', price: '0.8943', change24h: '1.23', volume24h: '650000000', maxLeverage: 150, icon: 'ada' },
      { symbol: 'AAVE/USD', name: 'Aave', category: 'crypto', price: '324.56', change24h: '2.11', volume24h: '180000000', maxLeverage: 150, icon: 'aave' },
      { symbol: 'SOL/USD', name: 'Solana', category: 'crypto', price: '234.78', change24h: '4.56', volume24h: '1200000000', maxLeverage: 150, icon: 'sol' },
      { symbol: 'BNB/USD', name: 'BNB', category: 'crypto', price: '712.34', change24h: '1.89', volume24h: '580000000', maxLeverage: 150, icon: 'bnb' },
      { symbol: 'APE/USD', name: 'ApeCoin', category: 'crypto', price: '1.23', change24h: '6.78', volume24h: '89000000', maxLeverage: 150, icon: 'ape' },
      { symbol: 'SHIB/USD', name: 'Shiba Inu', category: 'crypto', price: '0.00002456', change24h: '12.34', volume24h: '780000000', maxLeverage: 150, icon: 'shib' },
      { symbol: 'AVAX/USD', name: 'Avalanche', category: 'crypto', price: '42.56', change24h: '3.45', volume24h: '320000000', maxLeverage: 150, icon: 'avax' },
      { symbol: 'ARB/USD', name: 'Arbitrum', category: 'crypto', price: '0.8765', change24h: '2.34', volume24h: '145000000', maxLeverage: 150, icon: 'arb' },
      { symbol: 'PEPE/USD', name: 'Pepe', category: 'crypto', price: '0.000021', change24h: '15.67', volume24h: '890000000', maxLeverage: 150, icon: 'pepe' },
      { symbol: 'WIF/USD', name: 'Dogwifhat', category: 'crypto', price: '2.34', change24h: '8.90', volume24h: '67000000', maxLeverage: 150, icon: 'wif' },
      { symbol: 'PNUT/USD', name: 'Peanut the Squirrel', category: 'crypto', price: '1.567', change24h: '23.45', volume24h: '123000000', maxLeverage: 150, icon: 'pnut' },

      // Major Forex Pairs
      { symbol: 'EUR/USD', name: 'Euro Dollar', category: 'forex', price: '1.0456', change24h: '-0.23', volume24h: '87650000000', maxLeverage: 1000, icon: 'eur' },
      { symbol: 'USD/JPY', name: 'Dollar Yen', category: 'forex', price: '149.56', change24h: '0.45', volume24h: '56780000000', maxLeverage: 1000, icon: 'jpy' },
      { symbol: 'GBP/USD', name: 'Pound Dollar', category: 'forex', price: '1.2789', change24h: '0.12', volume24h: '45670000000', maxLeverage: 1000, icon: 'gbp' },
      { symbol: 'USD/CAD', name: 'Dollar Canadian', category: 'forex', price: '1.3456', change24h: '-0.34', volume24h: '23450000000', maxLeverage: 1000, icon: 'cad' },
      { symbol: 'EUR/JPY', name: 'Euro Yen', category: 'forex', price: '156.78', change24h: '0.23', volume24h: '34560000000', maxLeverage: 1000, icon: 'eur' },

      // Major Stocks
      { symbol: 'AAPL/USD', name: 'Apple Inc', category: 'stocks', price: '234.56', change24h: '1.23', volume24h: '12340000000', maxLeverage: 25, icon: 'aapl' },
      { symbol: 'MSFT/USD', name: 'Microsoft', category: 'stocks', price: '456.78', change24h: '0.89', volume24h: '8760000000', maxLeverage: 25, icon: 'msft' },
      { symbol: 'NVDA/USD', name: 'NVIDIA', category: 'stocks', price: '876.54', change24h: '3.45', volume24h: '15670000000', maxLeverage: 25, icon: 'nvda' },
      { symbol: 'META/USD', name: 'Meta Platforms', category: 'stocks', price: '567.89', change24h: '2.11', volume24h: '9870000000', maxLeverage: 25, icon: 'meta' },
      { symbol: 'GOOGL/USD', name: 'Alphabet Inc', category: 'stocks', price: '178.90', change24h: '1.67', volume24h: '6540000000', maxLeverage: 25, icon: 'googl' },
      { symbol: 'AMZN/USD', name: 'Amazon', category: 'stocks', price: '198.76', change24h: '0.98', volume24h: '7890000000', maxLeverage: 25, icon: 'amzn' },
      { symbol: 'TSLA/USD', name: 'Tesla Inc', category: 'stocks', price: '432.10', change24h: '4.56', volume24h: '11230000000', maxLeverage: 25, icon: 'tsla' },
      { symbol: 'MSTR/USD', name: 'MicroStrategy', category: 'stocks', price: '567.43', change24h: '8.90', volume24h: '2340000000', maxLeverage: 25, icon: 'mstr' },

      // Major Indices
      { symbol: 'SPY/USD', name: 'S&P 500 ETF', category: 'indices', price: '567.89', change24h: '0.78', volume24h: '23450000000', maxLeverage: 250, icon: 'spy' },
      { symbol: 'QQQ/USD', name: 'Nasdaq 100 ETF', category: 'indices', price: '487.65', change24h: '1.23', volume24h: '18760000000', maxLeverage: 250, icon: 'qqq' },
      { symbol: 'IWM/USD', name: 'Russell 2000 ETF', category: 'indices', price: '234.56', change24h: '0.45', volume24h: '8760000000', maxLeverage: 250, icon: 'iwm' },
      { symbol: 'DIA/USD', name: 'Dow Jones ETF', category: 'indices', price: '456.78', change24h: '0.67', volume24h: '6540000000', maxLeverage: 250, icon: 'dia' },

      // Major Commodities
      { symbol: 'XAU/USD', name: 'Gold', category: 'commodities', price: '2678.90', change24h: '0.89', volume24h: '12340000000', maxLeverage: 250, icon: 'xau' },
      { symbol: 'XAG/USD', name: 'Silver', category: 'commodities', price: '31.45', change24h: '1.23', volume24h: '3450000000', maxLeverage: 250, icon: 'xag' },
      { symbol: 'WTI/USD', name: 'WTI Crude Oil', category: 'commodities', price: '78.90', change24h: '2.34', volume24h: '8760000000', maxLeverage: 250, icon: 'wti' },
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
      walletAddress: insertUser.walletAddress || null,
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
      minPositionSize: insertPair.minPositionSize || '10',
      spreadP: insertPair.spreadP || '0.05',
      pairIndex: insertPair.pairIndex || null,
      isActive: true,
      icon: insertPair.icon || null,
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

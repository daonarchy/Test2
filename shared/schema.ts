import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // crypto, stocks, forex, commodities
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  change24h: decimal("change_24h", { precision: 10, scale: 4 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 18, scale: 2 }).notNull(),
  maxLeverage: integer("max_leverage").notNull(),
  isActive: boolean("is_active").default(true),
  icon: text("icon"), // CSS class or icon identifier
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  pairId: integer("pair_id").references(() => tradingPairs.id),
  type: text("type").notNull(), // market, limit
  direction: text("direction").notNull(), // long, short
  size: decimal("size", { precision: 18, scale: 8 }).notNull(),
  leverage: integer("leverage").notNull(),
  collateralToken: text("collateral_token").notNull().default("USDC"), // USDC, DAI, WETH, APE
  collateralIndex: integer("collateral_index").notNull().default(3), // Gains Network collateral index
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }),
  limitPrice: decimal("limit_price", { precision: 18, scale: 8 }),
  takeProfit: decimal("take_profit", { precision: 18, scale: 8 }),
  stopLoss: decimal("stop_loss", { precision: 18, scale: 8 }),
  status: text("status").notNull().default("pending"), // pending, filled, cancelled
  marginRequired: decimal("margin_required", { precision: 18, scale: 8 }).notNull(),
  liquidationPrice: decimal("liquidation_price", { precision: 18, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderId: integer("order_id").references(() => orders.id),
  pairId: integer("pair_id").references(() => tradingPairs.id),
  direction: text("direction").notNull(),
  size: decimal("size", { precision: 18, scale: 8 }).notNull(),
  leverage: integer("leverage").notNull(),
  collateralToken: text("collateral_token").notNull().default("USDC"), // USDC, DAI, WETH, APE
  collateralIndex: integer("collateral_index").notNull().default(3), // Gains Network collateral index
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }).notNull(),
  pnl: decimal("pnl", { precision: 18, scale: 8 }).notNull().default("0"),
  marginUsed: decimal("margin_used", { precision: 18, scale: 8 }).notNull(),
  liquidationPrice: decimal("liquidation_price", { precision: 18, scale: 8 }).notNull(),
  takeProfit: decimal("take_profit", { precision: 18, scale: 8 }),
  stopLoss: decimal("stop_loss", { precision: 18, scale: 8 }),
  status: text("status").notNull().default("open"), // open, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertTradingPairSchema = createInsertSchema(tradingPairs).omit({
  id: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pnl: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;
export type TradingPair = typeof tradingPairs.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;

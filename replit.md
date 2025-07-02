# Trading Platform

## Overview

This is a modern trading platform application built with React, Express, and TypeScript. The application allows users to trade various financial instruments including cryptocurrencies, stocks, forex, and commodities with leverage trading capabilities. It features a mobile-first design with real-time market data integration and wallet connectivity.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom trading-themed design system
- **Component Library**: shadcn/ui components for consistent UI patterns

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development Server**: Custom Vite integration for SSR-like development experience
- **Request Handling**: Express middleware for JSON parsing, logging, and error handling

### Database & ORM
- **Database**: PostgreSQL (configured for production deployment)
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless connection in production
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing

## Key Components

### Trading Engine
- **Order Management**: Support for market and limit orders with leverage up to configurable maximums
- **Position Tracking**: Real-time position monitoring with P&L calculations
- **Risk Management**: Liquidation price calculations and margin requirements
- **Order Types**: Long and short positions with take profit and stop loss capabilities

### Market Data Integration
- **TradingView Integration**: Real-time charting with TradingView widgets
- **Multi-Asset Support**: Crypto, stocks, forex, and commodities
- **Price Feeds**: Real-time price updates with 24h change and volume data
- **Category Filtering**: Organized asset categories for better navigation

### Wallet Integration
- **Mock Implementation**: Development-ready wallet connection simulation
- **Chain Support**: Configured for Polygon network
- **Future Integration**: Prepared for @farcaster/frame-wagmi-connector integration
- **Address Management**: Persistent wallet state with localStorage

### User Interface
- **Mobile-First Design**: Responsive layout optimized for mobile trading
- **Dark Theme**: Trading-focused dark color scheme
- **Component System**: Reusable UI components with consistent styling
- **Real-time Updates**: Live price feeds and position updates
- **Modal Trading Interface**: Streamlined order placement workflow

## Data Flow

1. **Market Data**: External APIs → Backend storage → Frontend queries → Real-time UI updates
2. **Order Placement**: User input → Frontend validation → Backend processing → Database persistence → Position creation
3. **Wallet Connection**: User action → Mock wallet service → State persistence → UI updates
4. **Asset Selection**: User navigation → Category filtering → Asset list display → Chart updates

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless connection
- **UI Framework**: Radix UI component primitives
- **Charts**: TradingView widget integration
- **HTTP Client**: Native fetch with TanStack Query wrapper
- **Form Handling**: React Hook Form with Zod validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production build optimization
- **PostCSS**: CSS processing with Tailwind
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Production Build
- **Frontend**: Vite production build with optimized bundling
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served from Express with Vite-built frontend
- **Environment**: Production mode with optimized configurations

### Platform Configuration
- **Replit**: Configured for autoscale deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Development**: Hot reload with Vite middleware integration
- **Database**: PostgreSQL 16 module with connection pooling

### Build Process
1. Frontend assets compiled with Vite
2. Backend bundled with ESBuild for production
3. Static file serving configured in Express
4. Environment-specific configurations applied

## Changelog

- June 26, 2025. Initial setup
- June 27, 2025. Enhanced UI for professional trading experience:
  - Added advanced trading modal with tabbed interface (Order/Advanced)
  - Implemented professional order entry with market/limit/stop order types
  - Added entry price controls and position sizing options (USD/Units)
  - Created quick trade buttons with percentage allocation (25%, 50%, 75%, MAX)
  - Added quick leverage selection buttons
  - Enhanced position summary with real-time calculations
  - Implemented order book and recent trades components
  - Added position tracker with P&L monitoring
  - Improved responsive design and mobile optimization
  - Added custom scrollbars and animations
  - Integrated FontAwesome icons and Inter font
  - Added TradingView chart integration
- January 2, 2025. Complete redesign to MEXC-style mobile interface:
  - Implemented compact MEXC-style header with gTrade branding
  - Created streamlined trading panel with Long/Short tabs
  - Added compact chart visualization with canvas-based price movements
  - Built position and order tracking components
  - Added asset selector with search functionality
  - Updated bottom navigation to match Gains Network platform features (Trade, Portfolio, Leaderboard, Analytics, Profile)
  - Implemented quick leverage selection (5x-100x)
  - Added real-time trading calculations (margin, position size, liquidation price)
  - Enhanced bottom navigation with full tab functionality:
    - Portfolio: positions and orders management with Dashboard/Rewards/Credits sub-tabs
    - Rewards: Gold Rush on Base program with $BtcUSD rewards (33,000+ every 2 weeks)
    - Credits: gTrade Credits discount system with 8-tier structure (up to 25% discount)
    - Analytics: comprehensive trading statistics and performance metrics
    - Profile: wallet connection, network switching, and trading statistics

## User Preferences

Preferred communication style: Simple, everyday language.
Trading interface improvements: Professional futures trading experience with comprehensive order types and price entry options.
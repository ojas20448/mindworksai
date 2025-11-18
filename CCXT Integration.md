# CCXT Integration

## What I Did
Added CCXT library to fetch real-time crypto data from Binance and display it in the app.

## Setup
```bash
cd server
npm install ccxt protobufjs
```

## Backend Changes

**New Files:**
- `server/controllers/market.controller.js` - Handles all crypto data requests
- `server/routes/market.routes.js` - API routes for crypto endpoints

**Modified:**
- `server/server.js` - Added market routes

**API Endpoints:**
- `/api/crypto/ticker?symbol=BTC/USDT` - Get price for one coin
- `/api/crypto/market-data?symbols=BTC/USDT,ETH/USDT` - Get prices for multiple coins
- `/api/crypto/markets` - List all available markets
- `/api/crypto/ohlcv?symbol=BTC/USDT&timeframe=1h` - Chart data
- `/api/coins?page=1` - Paginated coin list (10 per page)
- `/api/coins/top50` - Top 50 coins

## Frontend Changes

**New Files:**
- `client/src/pages/StockDetails/CryptoChart.jsx` - Price chart with timeframe selector

**Modified:**
- `client/src/services/cryptoApi.js` - API calls to backend
- `client/src/components/custome/CryptoData.jsx` - Shows ticker data, markets, and top coins
- `client/src/pages/Home/Home.jsx` - Added chart to right sidebar
- `client/src/pages/Home/AssetTable.jsx` - Better error handling
- `client/src/Redux/Coin/Action.js` - Fixed API paths

## How It Works

**All Tab:** Shows paginated list of coins from Binance

**Top 50 Tab:** Displays top 50 coins by volume

**Live Trading Tab:** 
- Left side: Current prices and market info
- Right side: Interactive price chart with 1D, 1W, 1M, 3M, 6M, 1Y views

All data comes from Binance through CCXT, no API keys needed for public data.

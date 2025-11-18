const ccxt = require('ccxt');

// Initialize Binance exchange
const exchange = new ccxt.binance({
  enableRateLimit: true,
});

module.exports = {
  getTicker: async (req, res) => {
    try {
      const symbol = req.query.symbol || 'BTC/USDT';
      
      if (!symbol.includes('/')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid symbol format. Use format like BTC/USDT',
        });
      }

      const ticker = await exchange.fetchTicker(symbol);

      res.json({
        success: true,
        data: {
          symbol: ticker.symbol,
          last: ticker.last,
          high: ticker.high,
          low: ticker.low,
          bid: ticker.bid,
          ask: ticker.ask,
          volume: ticker.baseVolume,
          quoteVolume: ticker.quoteVolume,
          percentage: ticker.percentage,
          change: ticker.change,
          timestamp: ticker.timestamp,
          datetime: ticker.datetime,
        },
      });
    } catch (error) {
      console.error('Error fetching ticker:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch ticker data',
        error: error.message,
      });
    }
  },

  getMarketData: async (req, res) => {
    try {
      const symbolsParam = req.query.symbols || 'BTC/USDT,ETH/USDT,BNB/USDT';
      const symbols = symbolsParam.split(',').map(s => s.trim());

      const tickerPromises = symbols.map(symbol => 
        exchange.fetchTicker(symbol).catch(err => ({
          error: true,
          symbol,
          message: err.message
        }))
      );

      const tickers = await Promise.all(tickerPromises);

      const marketData = tickers
        .filter(ticker => !ticker.error)
        .map(ticker => ({
          symbol: ticker.symbol,
          last: ticker.last,
          high: ticker.high,
          low: ticker.low,
          volume: ticker.baseVolume,
          percentage: ticker.percentage,
          change: ticker.change,
        }));

      const errors = tickers
        .filter(ticker => ticker.error)
        .map(ticker => ({ symbol: ticker.symbol, message: ticker.message }));

      res.json({
        success: true,
        data: marketData,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error('Error fetching market data:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch market data',
        error: error.message,
      });
    }
  },

  getMarkets: async (req, res) => {
    try {
      await exchange.loadMarkets();
      
      const usdtMarkets = Object.keys(exchange.markets)
        .filter(market => market.endsWith('/USDT'))
        .slice(0, 50);

      res.json({
        success: true,
        data: {
          markets: usdtMarkets,
          count: usdtMarkets.length,
        },
      });
    } catch (error) {
      console.error('Error fetching markets:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch markets',
        error: error.message,
      });
    }
  },

  getOHLCV: async (req, res) => {
    try {
      const symbol = req.query.symbol || 'BTC/USDT';
      const timeframe = req.query.timeframe || '1h';
      const limit = parseInt(req.query.limit) || 100;

      const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);

      const formattedData = ohlcv.map(candle => ({
        timestamp: candle[0],
        datetime: new Date(candle[0]).toISOString(),
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
      }));

      res.json({
        success: true,
        data: {
          symbol,
          timeframe,
          candles: formattedData,
        },
      });
    } catch (error) {
      console.error('Error fetching OHLCV:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch OHLCV data',
        error: error.message,
      });
    }
  },

  getCoinList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      
      await exchange.loadMarkets();
      const usdtMarkets = Object.keys(exchange.markets)
        .filter(market => market.endsWith('/USDT'))
        .slice(0, 100);


      const start = (page - 1) * limit;
      const paginatedMarkets = usdtMarkets.slice(start, start + limit);

      const tickers = await Promise.all(
        paginatedMarkets.map(async symbol => {
          try {
            const ticker = await exchange.fetchTicker(symbol);
            return {
              id: symbol.toLowerCase().replace('/', '-'),
              symbol: symbol.split('/')[0],
              name: symbol.split('/')[0],
              image: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${symbol.split('/')[0].toLowerCase()}.png`,
              current_price: ticker.last,
              market_cap: ticker.quoteVolume || 0,
              market_cap_change_percentage_24h: ticker.percentage || 0,
              total_volume: ticker.baseVolume,
              high_24h: ticker.high,
              low_24h: ticker.low,
            };
          } catch (err) {
            return null;
          }
        })
      );

      const validTickers = tickers.filter(t => t !== null);

      res.json(validTickers);
    } catch (error) {
      console.error('Error fetching coin list:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch coin list',
        error: error.message,
      });
    }
  },

  getTop50: async (req, res) => {
    try {
      await exchange.loadMarkets();
      const usdtMarkets = Object.keys(exchange.markets)
        .filter(market => market.endsWith('/USDT'))
        .slice(0, 50);

      const tickers = await Promise.all(
        usdtMarkets.map(async symbol => {
          try {
            const ticker = await exchange.fetchTicker(symbol);
            return {
              id: symbol.toLowerCase().replace('/', '-'),
              symbol: symbol.split('/')[0],
              name: symbol.split('/')[0],
              image: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/${symbol.split('/')[0].toLowerCase()}.png`,
              current_price: ticker.last,
              market_cap: ticker.quoteVolume || 0,
              market_cap_change_percentage_24h: ticker.percentage || 0,
              total_volume: ticker.baseVolume,
              high_24h: ticker.high,
              low_24h: ticker.low,
            };
          } catch (err) {
            return null;
          }
        })
      );

      const validTickers = tickers.filter(t => t !== null);
      res.json(validTickers);
    } catch (error) {
      console.error('Error fetching top 50:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top 50 coins',
        error: error.message,
      });
    }
  },
};

const ccxt = require('ccxt');

class CCXTService {
  constructor() {
    this.exchange = new ccxt.binance({
      sandbox: false,
      enableRateLimit: true,
      timeout: 30000,
    });
  }

  async getMarketData(symbol = 'BTC/USDT') {
    try {
      const ticker = await this.exchange.fetchTicker(symbol);
      return {
        symbol: ticker.symbol,
        price: ticker.last,
        high: ticker.high,
        low: ticker.low,
        volume: ticker.baseVolume,
        timestamp: ticker.timestamp,
        change: ticker.change,
        percentage: ticker.percentage
      };
    } catch (error) {
      throw new Error(`Failed to fetch market data: ${error.message}`);
    }
  }

  async getExchangeInfo() {
    try {
      const markets = await this.exchange.loadMarkets();
      return {
        exchangeName: this.exchange.name,
        marketCount: Object.keys(markets).length,
        supportedSymbols: Object.keys(markets).slice(0, 10)
      };
    } catch (error) {
      throw new Error(`Failed to fetch exchange info: ${error.message}`);
    }
  }

  async getMultipleMarkets() {
    try {
      const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'];
      const promises = symbols.map(symbol => this.getMarketData(symbol));
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch multiple markets: ${error.message}`);
    }
  }
}

module.exports = new CCXTService();
const API_BASE_URL = 'http://localhost:8000/api';

export const cryptoApi = {
  async getTicker(symbol = 'BTC/USDT') {
    try {
      console.log(`Frontend: Requesting ticker for ${symbol}`);
      
      const response = await fetch(`${API_BASE_URL}/crypto/ticker?symbol=${encodeURIComponent(symbol)}`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Ticker data received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching ticker:', error);
      throw error;
    }
  },

  async getMarketData(symbols = 'BTC/USDT,ETH/USDT,BNB/USDT') {
    try {
      console.log('Frontend: Requesting market data for multiple symbols');
      
      const response = await fetch(`${API_BASE_URL}/crypto/market-data?symbols=${encodeURIComponent(symbols)}`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Market data received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching market data:', error);
      throw error;
    }
  },

  async getMarkets() {
    try {
      console.log('Frontend: Requesting available markets');
      
      const response = await fetch(`${API_BASE_URL}/crypto/markets`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Markets received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching markets:', error);
      throw error;
    }
  },

  async getOHLCV(symbol = 'BTC/USDT', timeframe = '1h', limit = 100) {
    try {
      console.log(`Frontend: Requesting OHLCV for ${symbol} ${timeframe}`);
      
      const response = await fetch(
        `${API_BASE_URL}/crypto/ohlcv?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}&limit=${limit}`
      );
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: OHLCV data received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching OHLCV:', error);
      throw error;
    }
  }
};
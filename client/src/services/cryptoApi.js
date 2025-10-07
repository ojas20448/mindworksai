const API_BASE_URL = 'http://localhost:8000/api';

export const cryptoApi = {
  async getMarketData(symbol = 'BTC/USDT') {
    try {
      console.log(`Frontend: Requesting market data for ${symbol}`);
      
      const encodedSymbol = encodeURIComponent(symbol);
      const response = await fetch(`${API_BASE_URL}/crypto/market-data/${encodedSymbol}`);
      
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

  async getMarketDataWithoutSymbol() {
    try {
      console.log('Frontend: Requesting default market data');
      
      const response = await fetch(`${API_BASE_URL}/crypto/market-data`);
      
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

  async getExchangeInfo() {
    try {
      console.log('Frontend: Requesting exchange info');
      
      const response = await fetch(`${API_BASE_URL}/crypto/exchange-info`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Exchange info received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching exchange info:', error);
      throw error;
    }
  },

  async getMultipleMarkets() {
    try {
      console.log('Frontend: Requesting multiple markets data');
      
      const response = await fetch(`${API_BASE_URL}/crypto/multiple-markets`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('API Response:', text);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Multiple markets data received:', data.data);
      return data;
    } catch (error) {
      console.error('Frontend: Error fetching multiple markets:', error);
      throw error;
    }
  }
};
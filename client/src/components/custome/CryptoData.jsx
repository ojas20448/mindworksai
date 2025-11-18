import React, { useState, useEffect } from 'react';
import { cryptoApi } from '../../services/cryptoApi';

const CryptoData = () => {
  const [tickerData, setTickerData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [availableMarkets, setAvailableMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');

  const fetchTickerData = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getTicker(symbol);
      setTickerData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getMarketData('BTC/USDT,ETH/USDT,BNB/USDT,ADA/USDT,SOL/USDT');
      setMarketData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getMarkets();
      setAvailableMarkets(response.data?.markets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickerData(selectedSymbol);
    fetchMarketData();
    fetchAvailableMarkets();
  }, [selectedSymbol]);

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  if (loading && !tickerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Live Trading Data</h2>
          <p className="text-sm text-gray-300">Real-time cryptocurrency data powered by CCXT (Binance)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">
            Trading Pair:
          </label>
          <select
            value={selectedSymbol}
            onChange={handleSymbolChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
          >
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/USDT">ETH/USDT</option>
            <option value="BNB/USDT">BNB/USDT</option>
            <option value="ADA/USDT">ADA/USDT</option>
            <option value="SOL/USDT">SOL/USDT</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ticker Data Card */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center text-black">
            {selectedSymbol} Ticker
            {loading && <div className="ml-2 animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>}
          </h3>
          {tickerData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Symbol:</span>
                <span className="font-medium text-black">{tickerData.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Last Price:</span>
                <span className="font-bold text-green-600">
                  ${tickerData.last?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">24h High:</span>
                <span className="text-black">${tickerData.high?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">24h Low:</span>
                <span className="text-black">${tickerData.low?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Volume:</span>
                <span className="text-black">{tickerData.volume?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">24h Change:</span>
                <span className={`font-medium ${tickerData.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tickerData.percentage > 0 ? '+' : ''}{tickerData.percentage?.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Bid/Ask:</span>
                <span className="text-xs text-black">${tickerData.bid?.toFixed(2)} / ${tickerData.ask?.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No ticker data available</p>
          )}
        </div>

        {/* Available Markets Card */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-3 text-black">Available Markets</h3>
          {availableMarkets.length > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Exchange:</span>
                <span className="font-medium text-black">Binance</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Total Markets:</span>
                <span className="font-medium text-black">{availableMarkets.length}</span>
              </div>
              <div className="mt-3">
                <span className="text-gray-700 text-sm block mb-2">Sample USDT Pairs:</span>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {availableMarkets.slice(0, 12).map((market, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Loading markets...</p>
          )}
        </div>

        {/* Multiple Markets Card */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-3 text-black">Top Cryptocurrencies</h3>
          {marketData.length > 0 ? (
            <div className="space-y-2">
              {marketData.map((market, index) => (
                <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0">
                  <div>
                    <span className="font-medium text-black">{market.symbol}</span>
                    <div className="text-xs text-gray-700">
                      ${market.last?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${market.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {market.percentage > 0 ? '+' : ''}{market.percentage?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Loading market data...</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => fetchTickerData(selectedSymbol)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <div className="mr-2 animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>}
          Refresh Ticker
        </button>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <div className="mr-2 animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>}
          Refresh Markets
        </button>
        <button
          onClick={fetchAvailableMarkets}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <div className="mr-2 animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>}
          Refresh All
        </button>
      </div>
    </div>
  );
};

export default CryptoData;
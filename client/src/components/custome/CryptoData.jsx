import React, { useState, useEffect } from 'react';
import { cryptoApi } from '../../services/cryptoApi';

const CryptoData = () => {
  const [marketData, setMarketData] = useState(null);
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [multipleMarkets, setMultipleMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');

  const fetchMarketData = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getMarketData(symbol);
      setMarketData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getExchangeInfo();
      setExchangeInfo(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultipleMarkets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoApi.getMultipleMarkets();
      setMultipleMarkets(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(selectedSymbol);
    fetchExchangeInfo();
    fetchMultipleMarkets();
  }, [selectedSymbol]);

  const handleSymbolChange = (e) => {
    setSelectedSymbol(e.target.value);
  };

  if (loading && !marketData) {
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
          <h2 className="text-xl font-semibold">Live Trading Data</h2>
          <p className="text-sm text-gray-600">Real-time cryptocurrency data powered by CCXT</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Trading Pair:
          </label>
          <select
            value={selectedSymbol}
            onChange={handleSymbolChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-3 flex items-center">
            Market Data
            {loading && <div className="ml-2 animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>}
          </h3>
          {marketData ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Symbol:</span>
                <span className="font-medium">{marketData.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-bold text-green-600">
                  ${marketData.price?.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">24h High:</span>
                <span>${marketData.high?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">24h Low:</span>
                <span>${marketData.low?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Volume:</span>
                <span>{marketData.volume?.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">24h Change:</span>
                <span className={`font-medium ${marketData.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.percentage > 0 ? '+' : ''}{marketData.percentage?.toFixed(2)}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No market data available</p>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-3">Exchange Info</h3>
          {exchangeInfo ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Exchange:</span>
                <span className="font-medium">{exchangeInfo.exchangeName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Markets:</span>
                <span className="font-medium">{exchangeInfo.marketCount}</span>
              </div>
              <div className="mt-3">
                <span className="text-gray-600 text-sm block mb-2">Sample Symbols:</span>
                <div className="flex flex-wrap gap-1">
                  {exchangeInfo.supportedSymbols?.slice(0, 6).map((symbol, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No exchange info available</p>
          )}
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-semibold mb-3">Top Cryptocurrencies</h3>
          {multipleMarkets.length > 0 ? (
            <div className="space-y-2">
              {multipleMarkets.map((market, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{market.symbol}</span>
                    <div className="text-xs text-gray-500">
                      ${market.price?.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${market.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {market.percentage > 0 ? '+' : ''}{market.percentage?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No market data available</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => fetchMarketData(selectedSymbol)}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <div className="mr-2 animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>}
          Refresh Market
        </button>
        <button
          onClick={fetchExchangeInfo}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading && <div className="mr-2 animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>}
          Refresh Exchange
        </button>
        <button
          onClick={fetchMultipleMarkets}
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
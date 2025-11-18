import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { cryptoApi } from "../../services/cryptoApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const timeSeries = [
  { label: "1 Day", value: 1, timeframe: "1h" },
  { label: "1 Week", value: 7, timeframe: "4h" },
  { label: "1 Month", value: 30, timeframe: "1d" },
  { label: "3 Month", value: 90, timeframe: "1d" },
  { label: "6 Month", value: 180, timeframe: "1d" },
  { label: "1 year", value: 365, timeframe: "1d" },
];

const CryptoChart = ({ symbol = "BTC/USDT" }) => {
  const [chartData, setChartData] = useState([]);
  const [activeType, setActiveType] = useState(timeSeries[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const limit = Math.min(activeType.value * 24, 500); // Limit API calls
        const response = await cryptoApi.getOHLCV(symbol, activeType.timeframe, limit);
        
        const formatted = response.data.candles.map(candle => ({
          time: new Date(candle.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: activeType.value === 1 ? '2-digit' : undefined,
            minute: activeType.value === 1 ? '2-digit' : undefined
          }),
          price: candle.close,
          timestamp: candle.timestamp,
        }));
        
        setChartData(formatted);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchChartData();
    }
  }, [symbol, activeType]);

  if (loading && chartData.length === 0) {
    return (
      <div className="h-[450px] w-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-4 border-t-gray-200 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div id="charts">
        <div className="toolbar space-x-2 mb-4">
          {timeSeries.map((item) => (
            <Button
              onClick={() => setActiveType(item)}
              key={item.label}
              variant={activeType.label !== item.label ? "outline" : ""}
            >
              {item.label}
            </Button>
          ))}
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div id="chart-timeline">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#47535E" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  stroke="#47535E"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  stroke="#47535E"
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #47535E',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#758AA2" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#758AA2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[450px] flex items-center justify-center text-gray-500">
              {loading ? 'Loading chart data...' : 'No chart data available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;

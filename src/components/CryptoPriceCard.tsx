'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CryptoPriceCardProps {
  id: string;
  name: string;
  symbol: string;
  color: string;
  onPay?: () => void;
}

interface PriceData {
  current: number;
  change24h: number;
  chartData: {
    labels: string[];
    prices: number[];
  };
}

export default function CryptoPriceCard({ id, name, symbol, color, onPay }: CryptoPriceCardProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current price data
        const priceResponse = await fetch(
          `/api/crypto/price?id=${id}`,
          { cache: 'no-store' }
        );
        
        const priceData = await priceResponse.json();
        
        // Check if we have price data for the requested coin
        if (!priceData[id]) {
          throw new Error(`Could not find price data for ${name}`);
        }
        
        // Fetch historical price data (7 days)
        const historyResponse = await fetch(
          `/api/crypto/history?id=${id}`,
          { cache: 'no-store' }
        );
        
        const historyData = await historyResponse.json();
        
        // Validate history data
        if (!historyData.prices || !Array.isArray(historyData.prices) || historyData.prices.length === 0) {
          throw new Error('Invalid historical data received');
        }
        
        // Format data
        const prices = historyData.prices.map((price: [number, number]) => price[1]);
        const labels = historyData.prices.map((price: [number, number]) => {
          const date = new Date(price[0]);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        setPriceData({
          current: priceData[id].usd,
          change24h: priceData[id].usd_24h_change || 0, // Default to 0 if not available
          chartData: {
            labels,
            prices,
          },
        });
        
        // Reset retry count on success
        setRetryCount(0);
      } catch (err) {
        console.error(`Error fetching data for ${name}:`, err);
        setError('Failed to fetch data');
        
        // If we have retried less than 3 times, retry after a delay
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Retry after 2 seconds
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, [id, name, retryCount]);

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
        backgroundColor: color,
        borderColor: 'rgba(0, 0, 0, 0.8)',
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
    },
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="bg-gray-700/40 backdrop-blur-sm border border-gray-600 rounded-xl shadow-lg overflow-hidden p-6 h-64">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-amber-500"></div>
          </motion.div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-red-400 mb-2">{error}</div>
          <button 
            onClick={handleRetry}
            className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        priceData && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-white">{name}</h3>
                <span className="ml-2 text-sm text-amber-500">{symbol.toUpperCase()}</span>
              </div>
              <motion.div 
                className={`flex items-center ${priceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm font-medium">
                  {priceData.change24h >= 0 ? '↑' : '↓'} {Math.abs(priceData.change24h).toFixed(2)}%
                </span>
              </motion.div>
            </div>
            
            <motion.div 
              className="text-2xl font-bold mb-2 text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ${priceData.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.div>
            
            <div className="flex-grow relative mt-2 mb-3">
              {priceData.chartData.prices.length > 0 ? (
                <Line
                  data={{
                    labels: priceData.chartData.labels,
                    datasets: [
                      {
                        data: priceData.chartData.prices,
                        borderColor: color,
                        backgroundColor: `${color}20`,
                        fill: true,
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No chart data available
                </div>
              )}
            </div>
            
            {onPay && (
              <motion.button
                onClick={onPay}
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto py-2 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded text-sm font-medium transition-all flex items-center justify-center gap-1 text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Pay with {symbol}
              </motion.button>
            )}
          </div>
        )
      )}
    </div>
  );
} 
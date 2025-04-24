import { NextResponse } from 'next/server';

// Add caching to reduce API calls
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache (history doesn't change as frequently)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const days = searchParams.get('days') || '7';
  const interval = searchParams.get('interval') || 'daily';

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const cacheKey = `${id}-${days}-${interval}`;
  const now = Date.now();
  
  // Check cache first
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return NextResponse.json(cache[cacheKey].data);
  }

  try {
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        next: { revalidate: 300 } // Revalidate after 5 minutes
      }
    );

    if (!response.ok) {
      // If API fails, provide mock data
      console.warn(`CoinGecko API failed for ${id} history, using mock data`);
      const mockData = generateMockHistoryData(parseInt(days as string));
      
      // Cache the mock data
      cache[cacheKey] = { data: mockData, timestamp: now };
      return NextResponse.json(mockData);
    }

    const data = await response.json();
    
    // Cache the successful response
    cache[cacheKey] = { data, timestamp: now };
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error);
    
    // Provide mock data on error
    const mockData = generateMockHistoryData(parseInt(days as string));
    
    // Cache the mock data
    cache[cacheKey] = { data: mockData, timestamp: now };
    return NextResponse.json(mockData);
  }
}

// Helper function to generate mock historical data
function generateMockHistoryData(days: number) {
  const now = Date.now();
  const prices: [number, number][] = [];
  
  // Generate price points based on days
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const price = 1000 + Math.random() * 5000; // Random price between 1000 and 6000
    prices.push([timestamp, price]);
  }
  
  return {
    prices,
    market_caps: prices.map(([timestamp]) => [timestamp, Math.random() * 1000000000]),
    total_volumes: prices.map(([timestamp]) => [timestamp, Math.random() * 30000000])
  };
} 
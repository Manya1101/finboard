const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

export async function fetchStockData({
  symbol,
  functionType,
  interval,
}) {
  const params = new URLSearchParams({
    function: functionType,
    symbol,
    apikey: API_KEY,
  });

  // For intraday data
  if (interval) {
    params.append("interval", interval);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Network error");
  }

  const data = await response.json();

  // Alpha Vantage error handling
  if (data["Error Message"]) {
    throw new Error("Invalid symbol or API error");
  }

  if (data["Note"]) {
    throw new Error("API limit reached");
  }

  return data;
}

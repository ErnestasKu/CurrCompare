export default class CurrencyService {
  async getCurrencyHistorical(baseCode, quotesCode, start, end, signal) {
    const params = new URLSearchParams();
    if (baseCode) params.append("baseCode", baseCode);
    if (quotesCode) params.append("quotesCode", quotesCode);
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const queryString = params.toString();

    const url = `${import.meta.env.VITE_URL}/api/currency/currency-data${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url, { signal });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`API Error: ${response.status}`);
    }
  }
}

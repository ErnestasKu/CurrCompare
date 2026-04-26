export default class CurrencyService {
  async getCurrencyHistorical(baseCode, quotesCode, start, end, signal) {
    const params = new URLSearchParams();
    if (baseCode) params.append("baseCode", baseCode);
    if (quotesCode) params.append("quotesCode", quotesCode);
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const queryString = params.toString();

    const url = `${import.meta.env.VITE_URL}/api/currency/currency-data${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      return null;
    }
  }
}

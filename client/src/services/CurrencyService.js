export default class CurrencyService {
  async getCurrencies() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/api/currency/supported-currencies`,
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      return null;
    }
  }

  async getCurrencyHistorical(code, start, end) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/api/currency/currency-historical?currency=${code}&start=${start}&end=${end}`,
      );
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

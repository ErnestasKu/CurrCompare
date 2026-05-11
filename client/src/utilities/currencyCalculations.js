export const calculateStats = (entry) => {
  console.log(entry);
  if (!entry || entry.length === 0) return null;

  const rates = entry.data.map((item) => item.rate);
  const first = rates[0];
  const last = rates[rates.length - 1];

  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  const squareDiffs = rates.map((value) => Math.pow(value - avg, 2));
  const stdDev = Math.sqrt(
    squareDiffs.reduce((a, b) => a + b, 0) / rates.length,
  );

  return {
    max: Math.max(...rates),
    min: Math.min(...rates),
    avg: rates.reduce((a, b) => a + b, 0) / rates.length,
    stdDev: stdDev,
    change: ((last - first) / first) * 100,
    current: last,
  };
};

export const transformCurrencyData = (currencies, data) => {
  return currencies.map((code) => ({
    id: code,
    data: data
      .filter((item) => item.quote === code)
      .map((item) => ({
        ...item,
        rate: item.rate ? parseFloat((1 / item.rate).toFixed(4)) : 0,
      })),
  }));
};
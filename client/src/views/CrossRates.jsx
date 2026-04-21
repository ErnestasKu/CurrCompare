import { useEffect, useState } from "react";
import CurrencyService from "../services/CurrencyService";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import { FaArrowDown, FaArrowUp, FaTimes } from "react-icons/fa";

export default function CrossRates() {
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    "EUR",
    "USD",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "XAU",
  ]);
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    async function fetchMatrixData() {
      try {
        const cs = new CurrencyService();
        const data = await cs.getCurrencyHistorical();

        const ratesMap = data.reduce(
          (acc, item) => {
            acc[item.quote] = item.rate;
            return acc;
          },
          { EUR: 1 },
        );
        setRates(ratesMap);
        console.log(ratesMap);
      } catch (error) {
        console.error("Matrix fetch failed", error);
      }
    }
    fetchMatrixData();
  }, []);

  const getCrossRate = (rowCurrency, colCurrency) => {
    if (rowCurrency === colCurrency) return (1 * amount).toFixed(4);
    if (!rates[rowCurrency] || !rates[colCurrency]) return "—";
    return ((rates[colCurrency] / rates[rowCurrency]) * amount).toFixed(4);
  };

  function handleAddCurrency(code) {
    setSelectedCurrencies((prev) => [...prev, code]);
  }

  const removeCurrency = (code) => {
    setSelectedCurrencies((prev) => prev.filter((c) => c !== code));
  };

  function moveCurrency(index, index2) {
    setSelectedCurrencies((prev) => {
      const newList = [...prev];
      const temp = newList[index2];
      newList[index2] = newList[index];
      newList[index] = temp;

      return newList;
    });
  }

  return (
    <div className="page-default space-y-6">
      <div className="page-title">Currency Cross-Rates</div>

      <div className="bubble flex justify-end">
        <div className="flex items-center">
          <div className="w-64">
            <DropdownCurrency
              data={currencyList.currencies}
              setSelected={handleAddCurrency}
            />
          </div>
        </div>
      </div>

      <div className="bubble overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-bg-dark divide-x">
              <th className="p-4 border-b border-bg-border flex flex-col gap-2">
                <label className="uppercase text-txt-dark text-left text-sm tracking-widest">
                  Amount
                </label>
                <input
                  className="page-select-field rounded w-full px-2 py-1 font-mono text-primary"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </th>
              {selectedCurrencies.map((code) => (
                <th
                  key={code}
                  title={currencyList.currencies[code].name}
                  className="border-b border-bg-border font-bold text-primary min-w-30"
                >
                  <div className="flex flex-col items-center">
                    {code} {currencyList.currencies[code].symbol} <br />
                    <span className="text-sm text-txt-dark font-mono truncate w-30">
                      {currencyList.currencies[code].name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedCurrencies.map((rowCode, index) => (
              <tr
                key={rowCode}
                className="hover:bg-bg-dark/50 transition-colors divide-x"
              >
                <td
                  title={currencyList.currencies[rowCode].name}
                  className="relative group p-4 border-b border-bg-border bg-bg-dark w-30"
                >
                  <button
                    onClick={() => removeCurrency(rowCode)}
                    className="opacity-0 group-hover:opacity-100 text-lg text-txt-dark hover:text-bad absolute right-2 top-2"
                  >
                    <FaTimes />
                  </button>
                  <span className="font-bold text-primary">
                    {rowCode} {currencyList.currencies[rowCode].symbol} <br />
                  </span>
                  <span className="text-xs text-txt-dark font-mono truncate w-30">
                    {currencyList.currencies[rowCode].name}
                  </span>
                  <div className="space-x-2 mt-1">
                    <button
                      className="bg-bg-lighter2 hover:bg-good/50 aspect-square p-2 rounded disabled:opacity-50"
                      disabled={index === 0 ? true : false}
                      onClick={() => moveCurrency(index, index - 1)}
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      className="bg-bg-lighter2 hover:bg-bad/50 aspect-square p-2 rounded disabled:opacity-50"
                      disabled={
                        index === selectedCurrencies.length - 1 ? true : false
                      }
                      onClick={() => moveCurrency(index, index + 1)}
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </td>
                {selectedCurrencies.map((colCode) => {
                  return (
                    <td
                      key={`${rowCode}-${colCode}`}
                      className={`text-lg border-b border-bg-border bg-bg-darker font-mono text-center hover:bg-primary-hover/50 ${
                        rowCode === colCode ? "text-txt-dark" : "text-txt-main"
                      }`}
                    >
                      <span className="text-primary">
                        {currencyList.currencies[colCode].symbol}
                      </span>
                      {Object.keys(rates).length > 0
                        ? getCrossRate(rowCode, colCode)
                        : "..."}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

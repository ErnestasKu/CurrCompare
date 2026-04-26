import { useContext, useEffect, useState } from "react";
import CurrencyService from "../services/CurrencyService";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import { FaArrowDown, FaArrowUp, FaTimes, FaUndo } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import { LuSave, LuTrash2 } from "react-icons/lu";
import crossRateService from "../services/CrossRateService";

export default function CrossRates() {
  const { auth } = useContext(AuthContext);
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

  const removeCurrency = (index) => {
    setSelectedCurrencies((prev) => prev.filter((c, i) => index !== i));
  };

  const handleDefaultSettings = () => {
    setAmount(1);
    setSelectedCurrencies(["EUR", "USD", "GBP", "JPY", "AUD", "CAD", "XAU"]);
  };

  const handleSaveSettings = async () => {
    try {
      await crossRateService.updateSettings(
        auth.id,
        {
          defaultAmount: amount,
          selectedCurrencies: selectedCurrencies,
        },
        auth.token,
      );
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  };

  const handleDeleteSettings = async () => {
    try {
      await crossRateService.updateSettings(
        auth.id,
        {
          defaultAmount: null,
          selectedCurrencies: [],
        },
        auth.token,
      );
      handleDefaultSettings();
    } catch (error) {
      console.error("Failed to clear settings", error);
    }
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

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (auth?.id && auth?.token) {
        try {
          const settings = await crossRateService.get(auth.id, auth.token);

          if (settings) {
            if (settings.defaultAmount) {
              setAmount(settings.defaultAmount);
            }
            if (
              Array.isArray(settings.selectedCurrencies) &&
              settings.selectedCurrencies.length > 0
            ) {
              setSelectedCurrencies(settings.selectedCurrencies);
            }
          }
        } catch (error) {
          console.error("Failed to load user settings:", error);
        }
      }
    };

    fetchUserSettings();
  }, [auth]);

  return (
    <div className="page-default space-y-6">
      <div className="md:flex justify-between items-end">
        <div className="bubble">
          <div className="flex items-center w-64 gap-2 pb-1">
            {auth && (
              <>
                <button
                  onClick={handleSaveSettings}
                  title="Save preset config"
                  className="save-data w-full flex justify-center"
                >
                  <LuSave />
                </button>
                <button
                  onClick={handleDeleteSettings}
                  title="Delete preset config"
                  className="clear-data w-full flex justify-center"
                >
                  <LuTrash2 />
                </button>
              </>
            )}

            <button
              onClick={handleDefaultSettings}
              title="Load default layout"
              className="default-data w-full flex justify-center"
            >
              <FaUndo /> {!auth && "Load default layout"}
            </button>
          </div>
        </div>

        <div className="page-title">
          Currency <br /> Cross-Rates
        </div>

        <div className="bubble">
          <div className="w-64">
            <DropdownCurrency
              isDisabled={selectedCurrencies?.length >= 20}
              data={currencyList.currencies}
              setSelected={handleAddCurrency}
            />
          </div>
        </div>
      </div>
      <div className="bubble overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-dark divide-x">
              <th className="p-4 border border-bg-border min-w-48 max-w-48 w-48">
                <div className="uppercase text-txt-dark text-left text-sm tracking-widest mb-1">
                  Amount
                </div>
                <input
                  className="page-select-field rounded w-full px-2 py-1 font-mono text-primary"
                  type="number"
                  value={amount}
                  max={1000000000000}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </th>
              {selectedCurrencies.map((code, index) => (
                <th
                  key={index}
                  title={currencyList.currencies[code].name}
                  className="border border-bg-border font-bold text-primary min-w-30"
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
                key={index}
                className="hover:bg-bg-dark/50 transition-colors divide-x"
              >
                <td
                  title={currencyList.currencies[rowCode].name}
                  className="relative group p-4 border border-bg-border bg-bg-dark w-30"
                >
                  <button
                    onClick={() => removeCurrency(index)}
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
                {selectedCurrencies.map((colCode, index) => {
                  return (
                    <td
                      key={`${index}`}
                      className={`text-lg border border-bg-border bg-bg-darker font-mono text-center hover:bg-primary-hover/50 ${
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

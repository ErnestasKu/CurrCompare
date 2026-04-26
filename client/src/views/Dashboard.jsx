import { useContext, useEffect, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import CurrencyChart from "./CurrencyChart";
import CurrencyService from "../services/CurrencyService";
import { format, subDays } from "date-fns";
import { RxCross2 } from "react-icons/rx";
import { LuSave, LuTrash2 } from "react-icons/lu";
import { AuthContext } from "../AuthContext";
import dashboardService from "../services/DashboardService";
import { FaUndo } from "react-icons/fa";

export default function Dashboard({}) {
  const { auth } = useContext(AuthContext);
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [selectedCurrencies, setSelectedCurrencies] = useState([
    "USD",
    "GBP",
    "JPY",
    "CHF",
    "XAU",
  ]);
  const [currencyData, setCurrencyData] = useState();

  function handleSelectBase(item) {
    setBaseCurrency(item);
  }

  function handleAddCurrency(code) {
    setSelectedCurrencies((prev) => [...prev, code]);
  }

  function handleRemoveCurrency(index) {
    setSelectedCurrencies((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChangeCurrency(index, code) {
    setSelectedCurrencies((prev) => {
      const newList = [...prev];
      newList[index] = code;
      return newList;
    });
  }

  const handleDefaultSettings = () => {
    setBaseCurrency("EUR");
    setSelectedCurrencies(["USD", "GBP", "JPY", "CHF", "XAU"]);
  };

  const handleSaveSettings = async () => {
    try {
      await dashboardService.updateSettings(
        auth.id,
        {
          baseCurrency: baseCurrency,
          watchlist: selectedCurrencies,
        },
        auth.token,
      );
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  };

  const handleDeleteSettings = async () => {
    try {
      await dashboardService.updateSettings(
        auth.id,
        {
          baseCurrency: null,
          watchlist: [],
        },
        auth.token,
      );
      handleDefaultSettings();
    } catch (error) {
      console.error("Failed to clear settings", error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function GetHistorical() {
      const today = format(new Date(), "yyyy-MM-dd");
      const startDate = format(subDays(today, 30), "yyyy-MM-dd");
      const currencyString = selectedCurrencies.join(",");

      try {
        const cs = new CurrencyService();
        const data = await cs.getCurrencyHistorical(
          baseCurrency,
          currencyString,
          startDate,
          today,
          signal,
        );
        setCurrencyData(data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch history:", error);
        }
      }
    }
    if (selectedCurrencies && baseCurrency) GetHistorical();
    return () => {
      controller.abort();
    };
  }, [baseCurrency, selectedCurrencies]);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (auth?.id && auth?.token) {
        try {
          const settings = await dashboardService.get(auth.id, auth.token);

          if (settings) {
            if (settings.baseCurrency) {
              setBaseCurrency(settings.baseCurrency);
            }
            if (
              Array.isArray(settings.watchlist) &&
              settings.watchlist.length > 0
            ) {
              setSelectedCurrencies(settings.watchlist);
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
      <div className="sm:flex justify-between items-end">
        <div className="bubble items-center flex sm:block">
          <div className="page-label">Base currency</div>

          <div className="w-64">
            <DropdownCurrency
              data={currencyList.currencies}
              selected={baseCurrency}
              setSelected={handleSelectBase}
            />
          </div>
        </div>

        <div className="page-title self-center">
          Monthly <br /> Market Rates
        </div>

        <div className="bubble flex flex-col items-center gap-1">
          <div className="flex items-center w-full gap-2 pb-1">
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
          <div className="w-64">
            <DropdownCurrency
              isDisabled={selectedCurrencies?.length >= 10}
              data={currencyList.currencies}
              setSelected={handleAddCurrency}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {selectedCurrencies.map((code, index) => {
          const filteredData =
            currencyData?.filter((item) => item.quote === code) || [];
          const rate = filteredData[0]?.rate;

          return (
            <div key={index} className="bubble flex gap-4 group">
              <div className="flex flex-col h-full w-2/5 min-w-0">
                <div className="flex justify-between">
                  <button
                    className="opacity-0 group-hover:opacity-100 text-txt-main hover:text-bad text-2xl w-fit rounded-2xl p-2 hover:bg-bad/10 transition"
                    onClick={() => handleRemoveCurrency(index)}
                  >
                    <RxCross2 />
                  </button>
                  <span className="text-sm uppercase px-2 py-1 bg-bg-dark rounded text-[10px] font-semibold border border-bg-border my-auto">
                    {baseCurrency}
                    <span className="text-primary"> / </span>
                    {code}
                  </span>
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex flex-col flex-1 justify-center py-4 bg">
                    <p className="text-txt-dark text-xs font-semibold uppercase truncate">
                      {currencyList.currencies?.[code]?.name || "Currency"}
                    </p>
                    <span className="text-2xl lg:text-3xl xl:text-4xl font-semibold mb-4 font-mono">
                      {currencyList.currencies?.[code] &&
                      filteredData[0]?.rate ? (
                        <>
                          <span className="text-primary">
                            {currencyList.currencies[code].symbol}
                          </span>
                          {filteredData[filteredData.length - 1].rate}
                        </>
                      ) : (
                        "..."
                      )}
                    </span>
                  </div>

                  <DropdownCurrency
                    data={currencyList.currencies}
                    selected={code}
                    setSelected={(c) => handleChangeCurrency(index, c)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <CurrencyChart
                  selectedCurrency={code}
                  currencyData={filteredData}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

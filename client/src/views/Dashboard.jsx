import { format, min, subDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { FaUndo } from "react-icons/fa";
import { LuSave, LuTrash2 } from "react-icons/lu";
import { RxActivityLog, RxGrid } from "react-icons/rx";
import { AuthContext } from "../AuthContext";
import CurrencyService from "../services/CurrencyService";
import dashboardService from "../services/DashboardService";
import currencyList from "../utilities/currencyList";
import Dashboard_compare from "./Dashboard_compare";
import Dashboard_grid from "./Dashboard_grid";
import DropdownCurrency from "./general/DropdownCurrency";
import Tabs from "./general/Tabs";
import {
  calculateStats,
  transformCurrencyData,
} from "../utilities/currencyCalculations";
import aiService from "../services/AiService";

export default function Dashboard() {
  const DEFAULT_QUOTES = ["USD", "GBP", "CAD", "CHF", "AUD"];
  const DEFAULT_BASE = "EUR";
  const MAX_CURRENCIES = 10;

  const { auth, setAuth } = useContext(AuthContext);
  const [baseCurrency, setBaseCurrency] = useState(DEFAULT_BASE);
  const [endDate, setEndDate] = useState();
  const [viewMode, setViewMode] = useState(1);
  const [isPercent, setIsPercent] = useState(false);

  const [selectedCurrencies, setSelectedCurrencies] = useState(DEFAULT_QUOTES);
  const [currencyData, setCurrencyData] = useState();
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const [AiCurrency, setAiCurrency] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState();
  const [lastFetchedCurrency, setLastFetchedCurrency] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(today, 30), "yyyy-MM-dd");

  function handleSelectBase(code) {
    // swap with selected
    if (selectedCurrencies.includes(code)) {
      setSelectedCurrencies((prev) => {
        const newList = [...prev];
        const index = newList.indexOf(code);
        newList[index] = baseCurrency;
        return newList;
      });
      setBaseCurrency(code);
      return;
    }

    setBaseCurrency(code);
  }

  function handleAddCurrency(code) {
    if (selectedCurrencies.includes(code)) return;
    setSelectedCurrencies((prev) => [...prev, code]);
  }

  function handleRemoveCurrency(index) {
    setSelectedCurrencies((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChangeCurrency(index, code) {
    // no change
    if (selectedCurrencies[index] === code) return;

    // swap with base
    if (code === baseCurrency) {
      setBaseCurrency(selectedCurrencies[index]);
      setSelectedCurrencies((prev) => {
        const newList = [...prev];
        newList[index] = code;
        return newList;
      });
      return;
    }

    // swap with existing in list
    if (selectedCurrencies.includes(code)) {
      setSelectedCurrencies((prev) => {
        const newList = [...prev];
        const existingIndex = newList.indexOf(code);
        const temp = newList[index];
        newList[index] = code;
        newList[existingIndex] = temp;
        return newList;
      });
      return;
    }

    // change to unused
    setSelectedCurrencies((prev) => {
      const newList = [...prev];
      newList[index] = code;
      return newList;
    });
  }

  // sets currency layout to default
  const handleDefaultSettings = () => {
    setBaseCurrency(DEFAULT_BASE);
    setSelectedCurrencies(DEFAULT_QUOTES);
  };

  // save currency layout to db
  const handleSaveSettings = async () => {
    try {
      await dashboardService.updateSettings(
        auth.id,
        {
          baseCurrency: baseCurrency,
          watchlist: selectedCurrencies,
        },
        auth,
        setAuth,
      );
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  };

  // delete currency layout from db
  const handleDeleteSettings = async () => {
    try {
      await dashboardService.updateSettings(
        auth.id,
        {
          baseCurrency: null,
          watchlist: [],
        },
        auth,
        setAuth,
      );
      handleDefaultSettings();
    } catch (error) {
      console.error("Failed to clear settings", error);
    }
  };

  // get AI analysis
  const loadPredictions = async (target) => {
    try {
      setIsAiLoading(true);

      const targetEntry = currencyData?.find((item) => item.id === target);
      const stats = calculateStats(targetEntry);
      const payload = {
        baseCurrency: baseCurrency,
        targetCurrency: target,
        startDate: startDate,
        endDate: today,
        stats: {
          max: stats.max,
          min: stats.min,
          change: stats.change,
          current: stats.current,
        },
      };
      const response = await aiService.getAiForecast(payload, auth, setAuth);
      if (response?.prediction) {
        setAiMessage(response.prediction);
        setLastFetchedCurrency(target);
      }
    } catch (error) {
      console.error("Failed to load predictions", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // fetches new data on state changes
  useEffect(() => {
    // abort controller in case of rapid changes causing race conditions
    // cancels previous fetch requrests if new ones come in
    const controller = new AbortController();
    const signal = controller.signal;

    async function GetHistorical() {
      setCurrencyLoading(true);

      try {
        const cs = new CurrencyService();
        const currencyString = selectedCurrencies.join(",");
        const data = await cs.getCurrencyHistorical(
          baseCurrency,
          currencyString,
          startDate,
          today,
          signal,
        );

        if (!data) {
          console.warn("No data received from service");
          return;
        }

        const reformedData = transformCurrencyData(selectedCurrencies, data);
        setCurrencyData(reformedData);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch history:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCurrencyLoading(false);
        }
      }
    }
    if (selectedCurrencies && baseCurrency) GetHistorical();
    return () => {
      controller.abort();
    };
  }, [baseCurrency, selectedCurrencies]);

  // load user saved layout if logged in
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (auth?.id && auth?.token) {
        try {
          const settings = await dashboardService.get(auth.id, auth, setAuth);

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
              isDisabled={selectedCurrencies?.length >= MAX_CURRENCIES}
              data={currencyList.currencies}
              setSelected={handleAddCurrency}
              disabled={[...selectedCurrencies, baseCurrency]}
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-linear-to-r from-transparent via-primary to-transparent h-px mb-3"></div>

      {/* toggle between grid and comparison view */}
      <div className="flex justify-end my-3">
        <Tabs
          setTab={setViewMode}
          Tab={viewMode}
          options={[1, 2]}
          labels={[
            <>
              <RxGrid /> Grid
            </>,
            <>
              <RxActivityLog /> Comparison
            </>,
          ]}
        />
      </div>

      {viewMode === 1 ? (
        <Dashboard_grid
          selectedCurrencies={selectedCurrencies}
          currencyData={currencyData}
          baseCurrency={baseCurrency}
          setSelectedCurrencies={setSelectedCurrencies}
          handleRemoveCurrency={handleRemoveCurrency}
          handleChangeCurrency={handleChangeCurrency}
        />
      ) : (
        <Dashboard_compare
          auth={auth}
          selectedCurrencies={selectedCurrencies}
          currencyData={currencyData}
          baseCurrency={baseCurrency}
          handleRemoveCurrency={handleRemoveCurrency}
          isPercent={isPercent}
          setIsPercent={setIsPercent}
          loadPredictions={loadPredictions}
          aiMessage={aiMessage}
          AiCurrency={AiCurrency}
          setAiCurrency={setAiCurrency}
          isAiLoading={isAiLoading}
          lastFetchedCurrency={lastFetchedCurrency}
          currencyLoading={currencyLoading}
        />
      )}
    </div>
  );
}

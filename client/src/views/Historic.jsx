import { useContext, useEffect, useRef, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import CurrencyChart from "./CurrencyChart";
import CurrencyService from "../services/CurrencyService";
import {
  addDays,
  differenceInDays,
  format,
  isValid,
  parseISO,
  subDays,
} from "date-fns";
import useClickOutside from "../utilities/useClickOutside";
import DatePicker from "react-datepicker";
import CalendarHeader from "./general/CalendarHeader";
import { RxCross2 } from "react-icons/rx";
import Tabs from "./general/Tabs";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import {
  calculateStats,
  transformCurrencyData,
} from "../utilities/currencyCalculations";
import Dropdown from "./general/Dropdown";
import aiService from "../services/AiService";
import { AuthContext } from "../AuthContext";

export default function Historic() {
  const MAX_CURRENCIES = 7;

  const { auth, setAuth } = useContext(AuthContext);
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [selectedCurrencies, setSelectedCurrencies] = useState(["USD"]);

  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  const [AiCurrency, setAiCurrency] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState();
  const [lastFetchedCurrency, setLastFetchedCurrency] = useState("");

  const [currencyData, setCurrencyData] = useState();
  const [isPercent, setIsPercent] = useState(false);
  const isAiDisabled =
    isAiLoading ||
    AiCurrency === null ||
    AiCurrency === undefined ||
    !selectedCurrencies[AiCurrency];

  // fetches new data on state changes
  useEffect(() => {
    // abort controller in case of rapid changes causing race conditions
    // cancels previous fetch requrests if new ones come in
    const controller = new AbortController();
    const signal = controller.signal;

    async function GetHistorical() {
      if (!baseCurrency || !selectedCurrencies || !startDate || !endDate)
        return;

      try {
        const cs = new CurrencyService();
        const currencyString = selectedCurrencies.join(",");
        const data = await cs.getCurrencyHistorical(
          baseCurrency,
          currencyString,
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd"),
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
      }
    }
    GetHistorical();
    return () => {
      controller.abort();
    };
  }, [baseCurrency, selectedCurrencies, startDate, endDate]);

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
        endDate: endDate,
        stats: {
          max: stats.max,
          min: stats.min,
          change: stats.change,
          current: stats.current,
        },
      };
      const response = await aiService.getAiHistorical(payload, auth, setAuth);
      if (response?.historical) {
        setAiMessage(response.historical);
        setLastFetchedCurrency(target);
      }
    } catch (error) {
      console.error("Failed to load historic analysis", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  function handleAddCurrency(code) {
    if (selectedCurrencies.includes(code)) return;
    setSelectedCurrencies((prev) => [...prev, code]);
  }

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

  function handleRemoveCurrency(index) {
    setSelectedCurrencies((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="page-default space-y-6">
      <div className="page-title">Historical Currency Data</div>

      {/* currency option buttons */}
      <div className="bubble grid lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="page-label">Base Currency</label>
          <DropdownCurrency
            data={currencyList.currencies}
            selected={baseCurrency}
            setSelected={handleSelectBase}
          />
        </div>

        <div>
          <label className="page-label">Target Currencies</label>
          <DropdownCurrency
            isDisabled={selectedCurrencies?.length >= MAX_CURRENCIES}
            data={currencyList.currencies}
            setSelected={handleAddCurrency}
            disabled={[...selectedCurrencies, baseCurrency]}
          />
        </div>

        <div className="relative">
          <label className="page-label">From</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                setStartDate(date);
                const dayGap = differenceInDays(endDate, date);
                if (dayGap < 0 || dayGap > 3700) {
                  setEndDate(addDays(date, 30));
                }
              }
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="page-select-field w-full"
            wrapperClassName="w-full"
            renderCustomHeader={CalendarHeader}
          />
        </div>

        <div className="relative">
          <label className="page-label">To</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              if (date && isValid(date)) {
                setEndDate(date);
                const dayGap = differenceInDays(date, startDate);
                if (dayGap < 0 || dayGap > 3700) {
                  setStartDate(addDays(date, -30));
                }
              }
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="page-select-field w-full"
            wrapperClassName="w-full"
            renderCustomHeader={CalendarHeader}
          />
        </div>
      </div>

      {/* data */}
      <div className="flex w-full gap-4">
        <div className="space-y-4 w-[30%]">
          {/* ai features only for logged in users */}
          {auth && (
            <div className="flex gap-4">
              <div className="bubble w-full h-fit">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="page-label">Currency</span>
                    <Dropdown
                      data={selectedCurrencies}
                      selected={AiCurrency}
                      setSelected={setAiCurrency}
                    />
                  </div>
                  <button
                    onClick={() =>
                      loadPredictions(selectedCurrencies[AiCurrency])
                    }
                    disabled={isAiDisabled}
                    className={`text-bg-dark font-mono font-bold w-full p-2 rounded-xl ${
                      isAiDisabled
                        ? "bg-primary-hover cursor-not-allowed"
                        : "bg-primary hover:bg-primary-hover"
                    } disabled:opacity-50`}
                  >
                    Get AI historical analysis
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="page-label uppercase text-txt-dark">
            Market Performance
          </div>
          {/* currency details */}
          <div className="grid grid-cols-1 gap-4">
            {(currencyData || []).map((group) => {
              const stats = calculateStats(group);
              const symbol = currencyList.currencies[baseCurrency].symbol;
              if (stats)
                return (
                  <div key={group.id} className="bubble bg-bg-dark/50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-xs text-txt-dark font-mono">
                          {baseCurrency} /
                        </span>
                        <div className="text-xl font-bold">{group.id}</div>
                      </div>
                      <div
                        className={`text-right ${stats.change >= 0 ? "text-good" : "text-bad"}`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          {stats.change >= 0 ? (
                            <LuTrendingUp />
                          ) : (
                            <LuTrendingDown />
                          )}
                          {stats.change.toFixed(2)}%
                        </div>
                        <p className="text-[10px] uppercase font-bold opacity-70">
                          Change
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-bg-border pt-3">
                      <StatItem
                        label="Highest"
                        value={stats.max}
                        symbol={symbol}
                        color="text-good"
                      />
                      <StatItem
                        label="Lowest"
                        value={stats.min}
                        symbol={symbol}
                        color="text-bad"
                      />
                      <StatItem
                        label="Average"
                        value={stats.avg}
                        symbol={symbol}
                      />
                      <StatItem
                        label="Current"
                        value={stats.current}
                        symbol={symbol}
                      />
                      <StatItem
                        label="Standard deviation"
                        value={stats.stdDev}
                      />
                    </div>
                  </div>
                );
            })}
            {selectedCurrencies.length === 0 && (
              <p className="text-sm text-txt-dark italic">
                Select a currency to see performance stats.
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          {/* graph */}
          <div className="bubble">
            <div className="flex mb-2 justify-between">
              <div className="flex items-center space-x-2">
                {selectedCurrencies.map((code, index) => (
                  <span
                    key={code}
                    className="flex items-center gap-1 p-2 py-1 rounded bg-bg-dark border border-bg-border font-mono"
                  >
                    {code}
                    <RxCross2
                      className="font-semibold cursor-pointer hover:text-bad hover:bg-bad/10"
                      onClick={() => handleRemoveCurrency(index)}
                    />
                  </span>
                ))}
              </div>

              <Tabs
                setTab={setIsPercent}
                Tab={isPercent}
                options={[false, true]}
                labels={["Flat", "%"]}
              />
            </div>

            <div className="flex-1 h-100">
              <CurrencyChart
                isComparison={true}
                selectedCurrency={selectedCurrencies}
                currencyData={currencyData}
                isPercentage={isPercent}
              />
            </div>
          </div>

          {/* ai info */}
          {isAiLoading ? (
            <div className="animate-spin mx-auto ml-8 rounded-full h-12 w-12 border-b-2 border-primary" />
          ) : aiMessage ? (
            <div className="bubble flex-1">
              <div className="page-label uppercase text-txt-dark">
                AI insight:
                <span className="text-primary">
                  {" " + lastFetchedCurrency}
                </span>
              </div>
              <p className="bg-bg-dark p-4 border-bg-border border rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
                {aiMessage.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
function StatItem({
  label,
  value,
  symbol,
  color = "text-txt-main",
  className,
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-txt-dark">
        {label}
      </p>
      <p className={`font-mono font-semibold ${color}`}>
        {symbol}
        {value?.toFixed(4)}
      </p>
    </div>
  );
}

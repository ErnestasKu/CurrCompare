import { useEffect, useRef, useState } from "react";
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

export default function Historic() {
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [targetCurrency, setTargetCurrency] = useState("USD");

  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  const [currencyData, setCurrencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function GetHistorical() {
      if (!baseCurrency || !targetCurrency || !startDate || !endDate) return;

      setIsLoading(true);
      try {
        const cs = new CurrencyService();
        const data = await cs.getCurrencyHistorical(
          baseCurrency,
          targetCurrency,
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd"),
          signal,
        );
        setCurrencyData(data);
      } catch (error) {
        // console.error("Failed to fetch history:", error);
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch history:", error);
        }
      } finally {
        // setIsLoading(false);
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    GetHistorical();
    return () => {
      controller.abort();
    };
  }, [baseCurrency, targetCurrency, startDate, endDate]);

  const currentRate = currencyData?.[currencyData?.length - 1]?.rate;
  const symbol = currencyList.currencies?.[targetCurrency]?.symbol || "";
  const rates = currencyData?.map((item) => item.rate) || [];
  const maxValue = rates.length > 0 ? Math.max(...rates) : 0;
  const minValue = rates.length > 0 ? Math.min(...rates) : 0;
  const sum = rates.length > 0 ? rates.reduce((sum, val) => sum + val, 0) : 0;
  const averageValue = rates.length > 0 ? sum / rates.length : 0;
  const percentageChange =
    rates.length > 1
      ? ((rates[rates.length - 1] - rates[0]) / rates[0]) * 100
      : 0;
  const stdDeviation =
    rates.length > 1
      ? Math.sqrt(
          rates.reduce(
            (sumSTD, val) => sumSTD + Math.pow(val - averageValue, 2),
            0,
          ) /
            (rates.length - 1),
        )
      : 0;

  return (
    <div className="page-default space-y-6">
      <div className="page-title">Historical Currency Data</div>

      <div className="bubble grid lg:grid-cols-4 gap-6 items-end">
        <div>
          <label className="page-label">Base Currency</label>
          <DropdownCurrency
            data={currencyList.currencies}
            selected={baseCurrency}
            setSelected={setBaseCurrency}
          />
        </div>

        <div>
          <label className="page-label">Target Currency</label>
          <DropdownCurrency
            data={currencyList.currencies}
            selected={targetCurrency}
            setSelected={setTargetCurrency}
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
                  // alert("Date gap limit is 10 years.");
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
                  // alert("Date gap limit is 10 years.");
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

      <div className="bubble flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col border-r border-bg-border pb-6 pr-8">
          <div className="flex justify-end ">
            <span className="px-4 py-2 mb-8 bg-bg-dark rounded text-sm font-semibold border border-bg-border uppercase">
              {baseCurrency}
              <span className="text-primary"> / </span>
              {targetCurrency}
            </span>
          </div>

          <div className="text-txt-dark">
            <div className="flex justify-between">
              Highest:
              <span className="font-semibold text-good">
                {symbol}
                {maxValue.toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between">
              Lowest:
              <span className="font-semibold text-red-500">
                {symbol}
                {minValue.toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between">
              Average:
              <span className="font-semibold text-txt-main">
                {symbol}
                {averageValue.toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between">
              Percent change:
              <span
                className={`font-semibold ${rates[0] > rates[rates.length - 1] ? "text-bad" : "text-good"}`}
              >
                {percentageChange.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between">
              Standard deviation:
              <span className="font-semibold text-txt-main">
                {stdDeviation.toFixed(4)}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1 justify-end mb-8">
            <p className="text-txt-dark font-semibold uppercase">
              {currencyList.currencies?.[targetCurrency]?.name || "Currency"}
            </p>

            <div className="font-mono text-5xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  <span className="text-primary">{symbol}</span>
                  {currentRate}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-txt-dark">Period:</span>
            <span className="font-semibold text-primary">
              {format(startDate, "yyyy-MM-dd")}
              <span className="text-txt-main">{" – "}</span>
              {format(endDate, "yyyy-MM-dd")}
            </span>
          </div>
        </div>

        <div className="flex-1 h-100">
          <CurrencyChart
            selectedCurrency={targetCurrency}
            currencyData={currencyData}
          />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import CurrencyHistorical from "./CurrencyHistorical";
import CurrencyService from "../services/CurrencyService";
import { format, subDays } from "date-fns";

export default function Historic() {
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [targetCurrency, setTargetCurrency] = useState("USD");

  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd"),
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [currencyData, setCurrencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function GetHistorical() {
      if (!baseCurrency || !targetCurrency || !startDate || !endDate) return;

      setIsLoading(true);
      try {
        const cs = new CurrencyService();
        const data = await cs.getCurrencyHistorical(
          baseCurrency,
          targetCurrency,
          startDate,
          endDate,
        );
        setCurrencyData(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    }
    GetHistorical();
  }, [baseCurrency, targetCurrency, startDate, endDate]);

  const currentRate = currencyData?.[0]?.rate;
  const symbol = currencyList.currencies?.[targetCurrency]?.symbol || "";

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

        <div>
          <label className="page-label">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="page-select-field"
          />
        </div>

        <div>
          <label className="page-label">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="page-select-field"
          />
        </div>
      </div>

      <div className="bubble flex flex-col lg:flex-row gap-8 min-h-[400px]">
        <div className="w-full lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-bg-border pb-6 lg:pb-0 lg:pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-bg-dark rounded text-[10px] font-bold border border-bg-border uppercase">
              {baseCurrency} / {targetCurrency}
            </span>
          </div>

          <p className="text-txt-dark text-sm font-semibold uppercase">
            {currencyList.currencies?.[targetCurrency]?.name || "Currency"}
          </p>

          <h2 className="text-5xl font-mono font-bold my-4">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${symbol}${currentRate || "0.00"}`
            )}
          </h2>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-txt-dark">Period:</span>
              <span className="font-semibold text-primary">
                {startDate} to {endDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[350px]">
          <CurrencyHistorical
            selectedCurrency={targetCurrency}
            currencyData={currencyData}
          />
        </div>
      </div>
    </div>
  );
}

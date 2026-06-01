import { useMemo, useState } from "react";
import CurrencyChart from "./CurrencyChart";
import { RxCross2 } from "react-icons/rx";
import Tabs from "./general/Tabs";
import { calculateStats } from "../utilities/currencyCalculations";
import Dropdown from "./general/Dropdown";

export default function Dashboard_compare({
  auth,
  selectedCurrencies,
  currencyData,
  baseCurrency,
  handleRemoveCurrency,
  isPercent,
  setIsPercent,
  loadPredictions,
  aiMessage,
  AiCurrency,
  setAiCurrency,
  isAiLoading,
  lastFetchedCurrency,
  currencyLoading,
}) {
  const isAiDisabled =
    isAiLoading ||
    AiCurrency === null ||
    AiCurrency === undefined ||
    !selectedCurrencies[AiCurrency];

  return (
    <div className="space-y-6">
      <div className="bubble flex-1">
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
            currencyData={currencyData}
            isPercentage={isPercent}
            currencyLoading={currencyLoading}
          />
        </div>
      </div>

      {/* ai features only for logged in users */}
      {auth && (
        <div className="flex gap-4">
          <div className="bubble w-[30%] h-fit">
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
                onClick={() => loadPredictions(selectedCurrencies[AiCurrency])}
                disabled={isAiDisabled}
                className={`text-bg-dark font-mono font-bold w-full p-2 rounded-xl ${
                  isAiDisabled
                    ? "bg-primary-hover cursor-not-allowed"
                    : "bg-primary hover:bg-primary-hover"
                } disabled:opacity-50`}
              >
                Get AI forecast
              </button>
            </div>
          </div>

          {isAiLoading ? (
            <div className="animate-spin my-auto ml-8 rounded-full h-12 w-12 border-b-2 border-primary" />
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
      )}
    </div>
  );
}

import { RxCross2 } from "react-icons/rx";
import currencyList from "../utilities/currencyList";
import CurrencyChart from "./CurrencyChart";
import DropdownCurrency from "./general/DropdownCurrency";

export default function Dashboard_grid({
  selectedCurrencies,
  currencyData,
  baseCurrency,
  setSelectedCurrencies,
  handleRemoveCurrency,
  handleChangeCurrency,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {selectedCurrencies.map((code, index) => {
        const currencyEntry = currencyData?.find((item) => item.id === code);
        const filteredData = currencyEntry?.data || [];

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
                  <p
                    title={`1 ${currencyList.currencies?.[code]?.name} =`}
                    className="text-txt-dark text-xs font-semibold uppercase truncate"
                  >
                    1 {currencyList.currencies?.[code]?.name} =
                  </p>
                  <span className="text-2xl lg:text-3xl xl:text-4xl font-semibold mb-4 font-mono">
                    {currencyList.currencies?.[code] &&
                    typeof filteredData[filteredData.length - 1]?.rate ===
                      "number" ? (
                      <>
                        <span className="text-primary">
                          {currencyList.currencies[baseCurrency].symbol}
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
  );
}

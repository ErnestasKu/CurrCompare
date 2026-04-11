import { useEffect, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import CurrencyHistorical from "./CurrencyHistorical";
import CurrencyService from "../services/CurrencyService";
import { format, subDays } from "date-fns";
import { RxCross2 } from "react-icons/rx";

export default function Dashboard({}) {
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  // const [selectedCurrency, setSelectedCurrency] = useState();
  // const [currencyData, setCurrencyData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    "USD",
    "GBP",
    "JPY",
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

  useEffect(() => {
    async function GetHistorical() {
      const today = format(new Date(), "yyyy-MM-dd");
      const lastWeek = format(subDays(today, 6), "yyyy-MM-dd");
      const currencyString = selectedCurrencies.join(",");

      const cs = new CurrencyService();
      const data = await cs.getCurrencyHistorical(
        baseCurrency,
        currencyString,
        lastWeek,
        today,
      );
      setCurrencyData(data);
      console.log(data);
    }
    if (selectedCurrencies) GetHistorical();
  }, [baseCurrency, selectedCurrencies]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 min-h-screen">
      <div className="bubble flex justify-between">
        <div>
          <div className="mb-2 uppercase tracking-wider">Base currency</div>

          <div className="w-64">
            <DropdownCurrency
              data={currencyList.currencies}
              selected={baseCurrency}
              setSelected={handleSelectBase}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-2xl font-semibold">Add currency</div>

          <div className="w-64">
            <DropdownCurrency
              data={currencyList.currencies}
              selected={null}
              setSelected={handleAddCurrency}
              disabled={baseCurrency}
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
            <div key={index} className="bubble flex gap-4 ">
              <div className="flex flex-col h-full w-[50%] min-w-0">
                <div className="flex justify-between">
                  <button
                    className="text-txt-main hover:text-bad text-2xl w-fit rounded-2xl p-2 hover:bg-bad/10 transition"
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
                      {currencyList.currencies?.[code] && filteredData[0]?.rate
                        ? currencyList.currencies[code].symbol +
                          filteredData[0]?.rate
                        : "..."}
                    </span>
                  </div>

                  <DropdownCurrency
                    data={currencyList.currencies}
                    selected={code}
                    setSelected={(c) => handleChangeCurrency(index, c)}
                  />
                </div>
              </div>

              <CurrencyHistorical
                selectedCurrency={code}
                currencyData={filteredData}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

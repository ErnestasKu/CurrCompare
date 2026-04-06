import { useEffect, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import CurrencyHistorical from "./CurrencyHistorical";
import CurrencyService from "../services/CurrencyService";

export default function Dashboard({}) {
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [currencyData, setCurrencyData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  function handleSelect(item) {
    setSelectedCurrency(item);
  }
  useEffect(() => {
    async function GetHistorical() {
      const cs = new CurrencyService();
      const data = await cs.getCurrencyHistorical(
        selectedCurrency,
        baseCurrency,
        "2026-01-20",
        "2026-04-06",
      );
      setCurrencyData(data);
      console.log(data);
    }
    if (selectedCurrency) GetHistorical();
  }, [selectedCurrency]);

  return (
    <div className="bg-bg-lighter/50 p-8 md:max-w-[80%] mx-auto">
      <CurrencyHistorical
        selectedCurrency={selectedCurrency}
        currencyData={currencyData}
      />

      <div>Select currency</div>
      <div className="w-64">
        <DropdownCurrency
          data={currencyList.currencies}
          selected={selectedCurrency}
          setSelected={handleSelect}
        />
      </div>
    </div>
  );
}

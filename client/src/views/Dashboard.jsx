import { useEffect, useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CurrencyService from "../services/CurrencyService";

export default function Dashboard({}) {
  const [selectedCurency, setSelectedCurency] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  function handleSelect(item) {
    setSelectedCurency(item);
  }

  const data = {
    amount: 1.0,
    base: "EUR",
    date: "2026-03-13",
    rates: {
      AUD: 1.6293,
      BRL: 6.0172,
      CAD: 1.5726,
      CHF: 0.9034,
      CNY: 7.9145,
      CZK: 24.437,
      DKK: 7.4726,
      GBP: 0.86503,
      HKD: 8.9827,
      HUF: 391.48,
      IDR: 19395.07,
      ILS: 3.5883,
      INR: 106.0205,
      ISK: 144.2,
      JPY: 182.85,
      KRW: 1711.87,
      MXN: 20.4517,
      MYR: 4.5198,
      NOK: 11.159,
      NZD: 1.9691,
      PHP: 68.301,
      PLN: 4.2675,
      RON: 5.0947,
      SEK: 10.7545,
      SGD: 1.4685,
      THB: 36.953,
      TRY: 50.7122,
      USD: 1.1476,
      ZAR: 19.2754,
    },
  };
  const chartData = Object.entries(data.rates).map(([currency, rate]) => ({
    currency,
    rate,
  }));

  useEffect(() => {
    async function GetCurr() {
      const cs = new CurrencyService();
      const data = await cs.getCurrencies();

      let obj = {};
      data.CcyTbl.CcyNtry.forEach((cur) => {
        obj[cur.Ccy] = {
          name_en: cur.CcyNm.find((n) => n["@lang"] === "EN")["#text"],
          name_lt: cur.CcyNm.find((n) => n["@lang"] === "LT")["#text"],
          numeric_code: cur.CcyNbr,
          minor_units: cur.CcyMnrUnts,
        };
      });
      console.log(JSON.stringify(obj, null, 2));
    }
    // GetCurr();
    async function GetHistorical() {
      const cs = new CurrencyService();
      const data = await cs.getCurrencyHistorical(
        selectedCurency,
        // new Date(),
        // new Date(),
        "2026-03-25",
        "2026-03-27",
      );
      console.log("AAAAAA");
      // console.log(selectedCurency);
      console.log(data);
    }

    if (selectedCurency) GetHistorical();
  }, [selectedCurency]);

  // const data = [1, 5, 6, 4, 1];
  return (
    <div className="bg-red-950 p-8 md:max-w-[80%] mx-auto">
      {/* <div className="w-full h-50">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="currency" />
            <YAxis />
            <Tooltip />
            <Line
              // type="monotone"
              dataKey="rate"
              // stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      <div>Select currency</div>
      <div className="w-64">
        <DropdownCurrency
          data={currencyList.currencies}
          selected={selectedCurency}
          setSelected={handleSelect}
        />
      </div>
    </div>
  );
}

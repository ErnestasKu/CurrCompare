import { useState } from "react";
import currencyList from "../utilities/currencyList";
import DropdownCurrency from "./general/DropdownCurrency";

export default function Dashboard({}) {
  const [selectedCurency, setSelectedCurency] = useState();
  function handleSelect(item) {
    setSelectedCurency(item);
  }

  // const labels = Utils.months({ count: 7 });
  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: "My First Dataset",
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       fill: false,
  //       borderColor: "rgb(75, 192, 192)",
  //       tension: 0.1,
  //     },
  //   ],
  // };

  // const config = {
  //   type: "line",
  //   data: data,
  // };

  // const chartInteractionModeNearest = new Chart(ctx, {
  //   type: "line",
  //   data: data,
  // });

  return (
    <div className="bg-red-950 p-8 md:max-w-[80%] mx-auto">
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

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CurrencyHistorical({ selectedCurrency, currencyData }) {
  const formatYAxis = (tickItem) => tickItem.toFixed(2);
  return (
    <div className="bg-black mx-auto w-full h-80 overflow-auto">
      {selectedCurrency && (
        <ResponsiveContainer className={"overflow-hidden"}>
          <LineChart data={currencyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#2d2f36"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              // tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              minTickGap={30}
              dy={10}
            />
            <YAxis
              // hide={false}
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={formatYAxis}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#60a5fa" }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 8, stroke: "#1e293b", strokeWidth: 3 }}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CurrencyChart({ selectedCurrency, currencyData }) {
  // const formatYAxis = (tickItem) => tickItem.toFixed(2);
  const isUp =
    currencyData?.length > 1 &&
    currencyData[0].rate < currencyData[currencyData.length - 1].rate;

  const chartColor = isUp ? "var(--color-good)" : "var(--color-bad)";
  const gradientId = `gradient-${selectedCurrency}`;
  return (
    <div className="bg-bg-dark mx-auto w-full h-full overflow-auto rounded-xl">
      {selectedCurrency && currencyData?.length > 0 && (
        <ResponsiveContainer className={"overflow-hidden"}>
          <AreaChart data={currencyData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={"var(--color-bg-lighter2"}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              // tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              minTickGap={30}
              dy={10}
              interval={"preserveStartEnd"}
            />

            <YAxis
              // hide={false}
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              dx={-10}
              tick={{
                fill: "var(--color-txt-dark)",
                fontSize: 10,
                fontWeight: 500,
              }}
              tickCount={5}
            />
            <Tooltip
              contentStyle={{
                // backgroundColor: "#1e293b",
                background: "var(--color-bg-lighter)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              // itemStyle={{ color: chartColor, fontWeight: "bold" }}
              labelStyle={{ color: "var(--color-txt-dark)" }}
              cursor={{ stroke: "var(--color-bg-lighter)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={chartColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              animationDuration={1000}
              activeDot={{
                r: 5,
                stroke: "var(--color-bg-main)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

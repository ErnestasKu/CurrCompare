import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CurrencyChart({
  selectedCurrency,
  currencyData,
  isComparison,
  isPercentage,
  currencyLoading = false,
}) {
  // transforms data into percentage if specified in isPercentage
  const prepareComparisonData = () => {
    if (
      !Array.isArray(currencyData) ||
      currencyData.length === 0 ||
      !currencyData[0]?.data
    ) {
      return [];
    }

    return currencyData[0].data.map((entry, index) => {
      const dataPoint = { date: entry.date };

      currencyData.forEach((group) => {
        const firstRate = group.data[0]?.rate || 1;
        const currentRate = group.data[index]?.rate || firstRate;

        if (isPercentage) {
          dataPoint[group.id] = parseFloat(
            (((currentRate - firstRate) / firstRate) * 100).toFixed(4),
          );
        } else {
          dataPoint[group.id] = currentRate;
        }
      });

      return dataPoint;
    });
  };

  const chartData = isComparison ? prepareComparisonData() : currencyData;
  const isUp =
    !isComparison &&
    currencyData?.length > 1 &&
    currencyData[0].rate < currencyData[currencyData.length - 1].rate;

  // up = green, therefore meant to display value, not inflation
  const chartColor = isUp ? "var(--color-good)" : "var(--color-bad)";
  const gradientId = `gradient-${selectedCurrency}`;

  // colors repeat every ten values, but that amount should never be reached anyways
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f59e0b", // amber
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#6366f1", // indigo
    "#f97316", // orange
    "#14b8a6", // teal
    "#a855f7", // purple
  ];

  return (
    <div className="bg-bg-dark mx-auto w-full h-full overflow-auto rounded-xl relative flex">
      {(isComparison
        ? currencyData?.length > 0
        : selectedCurrency && currencyData?.length > 0) && (
        <ResponsiveContainer
          width="100%"
          height="100%"
          // prevents chart from spamming warnings in console
          initialDimension={{ width: 1, height: 1 }}
          className={"overflow-hidden"}
        >
          {isComparison ? (
            // multi currency/color chart
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-bg-lighter2)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                minTickGap={30}
                dy={8}
              />

              <YAxis
                domain={["auto", "auto"]}
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
                  background: "var(--color-bg-lighter)",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  padding: "8px",
                  paddingBottom: "0px",
                }}
                formatter={(value, name) => [
                  `${name}: ${value.toFixed(4)}${isPercentage ? "%" : ""}`,
                ]}
              />
              <Legend verticalAlign="top" height={30} iconType="circle" />
              {currencyData.map((group, index) => (
                <Line
                  key={group.id}
                  type="monotone"
                  dataKey={group.id}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                  dot={false}
                  animationDuration={1000}
                />
              ))}
            </LineChart>
          ) : (
            // single currency green/red chart
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
                stroke={"var(--color-bg-lighter2)"}
              />

              <XAxis
                dataKey="date"
                tick={{ fill: "var(--color-txt-alt)", fontSize: 12 }}
                minTickGap={30}
                axisLine={false}
                dy={8}
                interval={"preserveStartEnd"}
              />

              <YAxis
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
                  background: "var(--color-bg-lighter)",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  padding: "8px",
                  paddingBottom: "0px",
                }}
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
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}

      {currencyLoading && (
        <div className="w-full h-full bg-black/50 rounded-xl absolute flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-24 w-24 border-b-3 border-primary" />
        </div>
      )}
    </div>
  );
}

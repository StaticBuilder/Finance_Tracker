import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function LineChartComponent({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, totalSpend, amount, icon } = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
          <p className="text-sm text-gray-700"><strong>{icon} {name}</strong></p>
          <p className="text-sm text-blue-500">Budget: Ksh.{amount}</p>
          <p className="text-sm text-red-500">Spent: Ksh.{totalSpend}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate the maximum value to set an appropriate Y-axis scale
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.totalSpend, item.amount))
  );

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-1xl mb-4 text-blue-600 text-center">Line Chart: Spend To Budget</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis
            domain={[0, dataMax => Math.max(maxValue * 1.1, dataMax)]}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `${(value / 1000).toFixed(2)}K`; // Format as K (thousands)
              }
              return value.toFixed(1); // Retain one decimal for smaller values
            }}
            tickCount={6} // Add more evenly spaced ticks
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="totalSpend" stroke="#EF4444" />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default LineChartComponent;


import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartSpendVsIncome({ totalIncome, totalSpend }) {
  // Data structure for the chart
  const data = [
    { name: "Total", totalIncome, totalSpend },
  ];

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Bar Chart: Income vs Spend</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <BarChart
          data={data}
          margin={{
            top: 7,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Separate bars for Income and Spend */}
          <Bar dataKey="totalIncome" fill="#10B981" name="Income" /> {/* Green for income */}
          <Bar dataKey="totalSpend" fill="#EF4444" name="Spend" />   {/* Red for spend */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartSpendVsIncome;

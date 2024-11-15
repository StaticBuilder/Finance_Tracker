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

function BarChartComponent({ budgetList }) {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, totalSpend, amount } = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
          <p className="text-sm text-gray-700"><strong>{name}</strong></p>
          <p className="text-sm text-blue-500">Budget: ${amount}</p>
          <p className="text-sm text-red-500">Spent: ${totalSpend}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <BarChart
          data={budgetList}
          margin={{
            top: 7,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#388E3C"  />
          <Bar dataKey="amount" stackId="b" fill="#4CAF50"  />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;

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

function BarChartComponent({ data }) {

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

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-1xl mb-4 text-blue-600 text-center">Bar Chart: Spend To Budget</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <BarChart
          data={data}
          margin={{
            top: 7,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#EF4444" />  {/* Red color */}
          <Bar dataKey="amount" stackId="b" fill="#3B82F6" />      {/* Blue color */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;

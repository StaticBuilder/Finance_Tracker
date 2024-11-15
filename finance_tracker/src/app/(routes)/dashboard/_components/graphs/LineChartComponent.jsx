import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function LineChartComponent({ data }) {
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
      <h2 className="font-bold text-lg">Activity - Line Chart</h2>
      <ResponsiveContainer width={"80%"} height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />}/>
          <Line type="monotone" dataKey="totalSpend" stroke="#8884d8" />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;

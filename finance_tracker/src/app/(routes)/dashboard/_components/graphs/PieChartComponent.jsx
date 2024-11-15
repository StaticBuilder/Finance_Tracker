import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

// Define your colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0A1F2', '#8E44AD'];

function PieChartComponent({ data }) {
  // Custom Tooltip
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
      <h2 className="font-bold text-lg">Activity - Pie Chart</h2>
      <ResponsiveContainer width={"80%"} height={400}>
        <PieChart>
          <Pie
            dataKey="totalSpend"  // Pie slices show the total spend of each category
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={50}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;

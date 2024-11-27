import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

// Define your colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0A1F2', '#8E44AD', '#1ABC9C'];

function PieChartComponentB({ data }) {
  // Transform data to ensure amount is a number
  const transformedData = data.map(item => ({
    ...item,
    amount: parseFloat(item.amount.replace(/,/g, '')), // Remove commas and convert to number
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, amount, icon, totalSpend } = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
          <p className="text-sm text-gray-700">
            <strong>{icon} {name}</strong>
          </p>
          <p className="text-sm text-blue-500">Budget: Ksh.{amount.toLocaleString()}</p>
          <p className="text-sm text-red-500">Spent: Ksh.{totalSpend}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-2xl p-5 h-[500px]">
      <h2 className="font-bold text-1xl mb-4 text-blue-600 text-center">Pie Chart: Budget Allocation</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={transformedData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            innerRadius="40%"
            // paddingAngle={5}
          >
            {transformedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry) => {
              const { payload } = entry;
              return `${payload.icon} ${value} (Ksh.${payload.amount.toLocaleString()})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponentB;



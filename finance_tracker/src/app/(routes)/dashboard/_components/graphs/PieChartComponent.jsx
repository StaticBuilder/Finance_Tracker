import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

// Define your colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D0A1F2', '#8E44AD'];

function PieChartComponent({ data }) {
  // Transform data to ensure totalSpend is a number
  const transformedData = data.map(item => ({
    ...item,
    totalSpend: parseFloat(
      typeof item.totalSpend === 'string' 
        ? item.totalSpend.replace(/,/g, '') 
        : item.totalSpend || 0
    ),
    amount: parseFloat(
      typeof item.amount === 'string' 
        ? item.amount.replace(/,/g, '') 
        : item.amount || 0
    )
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, totalSpend, amount, icon } = payload[0].payload;
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
          <p className="text-sm text-gray-700">
            <strong>{icon} {name}</strong>
          </p>
          <p className="text-sm text-blue-500">
            Budget: Ksh.{amount.toLocaleString()}
          </p>
          <p className="text-sm text-red-500">
            Spent: Ksh.{totalSpend.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-2xl p-5 h-[500px]">
      <h2 className="font-bold text-lg mb-4">Pie Chart: Spend Distribution</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            dataKey="totalSpend"
            data={transformedData}
            cx="50%"
            cy="50%"
            outerRadius="70%"
            innerRadius="40%"
            //paddingAngle={5}
            // label={({ name, totalSpend, icon }) => 
            //   `${icon} ${name}: Ksh.${totalSpend.toLocaleString()}`
            // }
            // labelLine
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
              return `${payload.icon} ${value} (Ksh.${payload.totalSpend.toLocaleString()})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
import React from 'react';
import {
  PieChart, Pie, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

// Shared color scheme
const COLORS = {
  primary: '#3B82F6',
  secondary: '#EF4444',
  accent: '#10B981',
  warning: '#F59E0B',
  purple: '#8B5CF6'
};

// Shared tooltip component
const CustomTooltip = ({ active, payload, tooltipType = 'comparison' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
        <p className="text-sm text-gray-700">
          <strong>{payload[0].payload.name}</strong>
        </p>
        {tooltipType === 'budget' ? (
          <>
            <p className="text-sm text-blue-500">
              Budget: Ksh.{payload[0].payload.amount?.toLocaleString()}
            </p>
            <p className="text-sm text-red-500">
              Spent: Ksh.{payload[0].payload.totalSpend?.toLocaleString()}
            </p>
          </>
        ) : (
          payload.map((entry, index) => (
            <p
              key={index}
              className={`text-sm ${
                index === 0 ? 'text-blue-500' : 'text-red-500'
              }`}
            >
              {entry.name}: Ksh.{entry.value?.toLocaleString()}
            </p>
          ))
        )}
      </div>
    );
  }
  return null;
};

export const EnhancedUniversalChart = ({
  type = 'bar',
  data,
  dataType = 'comparison', // 'comparison' or 'budget'
  value1,
  value2,
  labels = ['Value 1', 'Value 2'],
  title = 'Chart'
}) => {
  // Transform comparison data if needed
  const comparisonData = dataType === 'comparison' 
    ? [{ name: 'Comparison', [labels[0]]: value1, [labels[1]]: value2 }]
    : data;

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={dataType === 'budget' ? data : [
                { name: labels[0], value: value1 },
                { name: labels[1], value: value2 }
              ]}
              dataKey={dataType === 'budget' ? "amount" : "value"}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={50}
              label={({ name, value }) => `${name}: ${value?.toLocaleString()}`}
            >
              {(dataType === 'budget' ? data : [
                { name: labels[0], value: value1 },
                { name: labels[1], value: value2 }
              ]).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={Object.values(COLORS)[index % Object.values(COLORS).length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip tooltipType={dataType} />} />
            <Legend />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={dataType === 'budget' ? data : comparisonData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip tooltipType={dataType} />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataType === 'budget' ? "amount" : labels[0]}
              stroke={COLORS.primary}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey={dataType === 'budget' ? "totalSpend" : labels[1]}
              stroke={COLORS.secondary}
              strokeWidth={2}
            />
          </LineChart>
        );

      default: // bar
        return (
          <BarChart data={dataType === 'budget' ? data : comparisonData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip tooltipType={dataType} />} />
            <Legend />
            <Bar
              dataKey={dataType === 'budget' ? "amount" : labels[0]}
              fill={COLORS.primary}
            />
            <Bar
              dataKey={dataType === 'budget' ? "totalSpend" : labels[1]}
              fill={COLORS.secondary}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedUniversalChart;
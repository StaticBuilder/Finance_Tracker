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

// Extended color palette for multiple categories
const EXTENDED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
];

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
  dataType = 'comparison',
  value1,
  value2,
  labels = ['Value 1', 'Value 2'],
  title = 'Chart'
}) => {
  // Transform budget data for pie chart
  const transformBudgetData = () => {
    if (!data) return [];
    
    // Transform and sort data by amount/spend for better visualization
    const sortedData = [...data].sort((a, b) => 
      (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0)
    );
    
    return [
      // First pie for budget amounts
      ...sortedData.map(item => ({
        name: `${item.name} (Budget)`,
        value: parseFloat(item.amount) || 0,
        category: item.name,
        type: 'Budget'
      })),
      // Second pie for spend amounts
      ...sortedData.map(item => ({
        name: `${item.name} (Spent)`,
        value: item.totalSpend || 0,
        category: item.name,
        type: 'Spent'
      }))
    ];
  };

  // Transform comparison data
  const comparisonData = dataType === 'comparison' 
    ? [{ name: 'Comparison', [labels[0]]: value1, [labels[1]]: value2 }]
    : data;

  const renderChart = () => {
    switch (type) {
      case 'pie':
        if (dataType === 'budget') {
          const transformedData = transformBudgetData();
          const budgetData = transformedData.filter(item => item.type === 'Budget');
          const spendData = transformedData.filter(item => item.type === 'Spent');
          
          return (
            <div className="flex flex-col h-full gap-4">
              <div className="w-full min-h-[300px] md:min-h-[350px]">
                <h3 className="text-center font-semibold text-blue-600 text-sm sm:text-base mb-2">
                  Budget Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={budgetData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label={({ value }) => `${value?.toLocaleString()}`}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell 
                          key={`cell-budget-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '12px',
                        maxWidth: '100%'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
          
              <div className="w-full min-h-[300px] md:min-h-[350px]">
                <h3 className="text-center font-semibold text-red-600 text-sm sm:text-base mb-2">
                  Spend Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={spendData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#82ca9d"
                      label={({ value }) => `${value?.toLocaleString()}`}
                    >
                      {spendData.map((entry, index) => (
                        <Cell 
                          key={`cell-spend-${index}`}
                          fill={EXTENDED_COLORS[index % EXTENDED_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip  />
                    <Legend 
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        paddingTop: '10px',
                        fontSize: '12px',
                        maxWidth: '100%'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        } else {
          // Original comparison pie chart logic
          return (
            <PieChart>
              <Pie
                data={[
                  { name: labels[0], value: value1 },
                  { name: labels[1], value: value2 }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={50}
                //label={({ name, value }) => `${name}: ${value?.toLocaleString()}`}
              >
                <Cell fill={COLORS.primary} />
                <Cell fill={COLORS.secondary} />
              </Pie>
              <Tooltip content={<CustomTooltip tooltipType={dataType} />} />
              <Legend />
            </PieChart>
          );
        }

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

  const getContainerHeight = (chartType, dataType) => {
    if (chartType === 'pie' && dataType === 'budget') {
      return {
        containerHeight: 'h-[800px] sm:h-[850px] md:h-[800px]', // Adjusted heights for different breakpoints
        chartHeight: 720
      };
    }
    return {
      containerHeight: 'h-[500px]',
      chartHeight: 420
    };
  };
  
  // In your return statement:
  const { containerHeight, chartHeight } = getContainerHeight(type, dataType);
  
  return (
    <div className={`border rounded-2xl p-5 ${containerHeight}`}>
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      <ResponsiveContainer 
        width="100%" 
        height={chartHeight}
      >
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedUniversalChart;
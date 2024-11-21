"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "../../../../../utils/schema"; // Make sure Incomes is imported
import EnhancedUniversalChart from "../_components/graphs/ChartContainer";
import { ChartWrapper } from "../_components/ChartExport";


function StatisticsPage() {
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState(null);
  //const [selectedGraph, setSelectedGraph] = useState("bar");
  const [selectedComparison, setSelectedComparison] = useState("income-spend");
  const [budgetList, setBudgetList] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [actualSavings, setActualSavings] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("bar");
  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    if (user) {
      setUserEmail(user.primaryEmailAddress?.emailAddress);
      getBudgetList();
      getIncomeList(); // Make sure to call this
    }
  }, [user]);

  useEffect(() => {
    if (incomeList.length > 0 && userEmail) {
      const userIncome = incomeList
        .filter((income) => income.createdBy === userEmail)
        .reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
      setTotalIncome(userIncome);
      console.log('Calculated total income:', userIncome); // Debug log
    }
  }, [incomeList, userEmail]);

  const getIncomeList = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .where(eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Incomes.id);

      console.log('Fetched income list:', result); // Debug log
      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  const getBudgetList = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log('Fetched budget list:', result); // Debug log
      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  useEffect(() => {
    if (totalIncome > 0 || budgetList.length > 0) {
      calculateCardInfo(totalIncome);
    }
  }, [totalIncome, budgetList]);

  const calculateCardInfo = (income) => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ += parseFloat(element.amount || 0);
      totalSpend_ += element.totalSpend || 0;
    });

    const expectedSavings_ = income - totalBudget_;
    const actualSavings_ = income - totalSpend_;

    console.log('Calculated totals:', { // Debug log
      totalBudget: totalBudget_,
      totalSpend: totalSpend_,
      expectedSavings: expectedSavings_,
      actualSavings: actualSavings_
    });

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    setExpectedSavings(expectedSavings_);
    setActualSavings(actualSavings_);
  };

  // Available comparisons configuration
  const comparisonOptions = [
    {
      value: "income-spend",
      label: "Income vs Spend",
      value1: totalIncome,
      value2: totalSpend,
      labels: ["Income", "Spend"]
    },
    {
      value: "savings",
      label: "Expected vs Actual Savings",
      value1: expectedSavings,
      value2: actualSavings,
      labels: ["Expected Savings", "Actual Savings"]
    },
    {
      value: "income-savings",
      label: "Income vs Actual Savings",
      value1: totalIncome,
      value2: actualSavings,
      labels: ["Income", "Actual Savings"]
    },
    {
      value: "income-budget",
      label: "Income vs Budget",
      value1: totalIncome,
      value2: totalBudget,
      labels: ["Income", "Budget"]
    },
    {
      value: "budget-list",
      label: "Budget vs Spend by Category",
    }
  ];

  // Get current comparison configuration
  const getCurrentComparison = () => {
    return comparisonOptions.find(option => option.value === selectedComparison) || comparisonOptions[0];
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">User Statistics</h1>
      
      {/* Chart Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="graphType" className="block text-gray-700 font-medium mb-2">
            Select Chart Type:
          </label>
          <select
            id="graphType"
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value)}
            className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div>
          <label htmlFor="comparison" className="block text-gray-700 font-medium mb-2">
            Select Comparison:
          </label>
          <select
            id="comparison"
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {comparisonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="text-lg font-semibold text-green-600">
            Ksh.{totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Spend</h3>
          <p className="text-lg font-semibold text-red-600">
            Ksh.{totalSpend.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
          <p className="text-lg font-semibold text-orange-600">
            Ksh.{totalBudget.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Expected Savings</h3>
          <p className="text-lg font-semibold text-blue-600">
            Ksh.{expectedSavings.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Actual Savings</h3>
          <p className="text-lg font-semibold text-purple-600">
            Ksh.{actualSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-lg shadow p-6">
        {selectedComparison === 'budget-list' ? (
          <ChartWrapper 
            title="Budget vs Spend by Category"
            exportable={true}
          >
            <EnhancedUniversalChart
              type={selectedGraph}
              data={budgetList}
              dataType="budget"
              title="Budget vs Spend by Category"
            />
          </ChartWrapper>
        ) : (
          <ChartWrapper 
            title={getCurrentComparison().label}
            exportable={true}
          >
            <EnhancedUniversalChart
              type={selectedGraph}
              dataType="comparison"
              value1={getCurrentComparison().value1}
              value2={getCurrentComparison().value2}
              labels={getCurrentComparison().labels}
              title={getCurrentComparison().label}
            />
          </ChartWrapper>
        )}
      </div>
    </div>
  );
}

export default StatisticsPage;


                
// return (
//   <div className="p-8">
//     <h1 className="text-3xl font-bold mb-4">User Statistics</h1>
//     <div className="mb-6">
//       <label htmlFor="graphType" className="block text-gray-700 font-medium mb-2">
//         Select Graph Type:
//       </label>
//       <select
//         id="graphType"
//         value={selectedGraph}
//         onChange={(e) => setSelectedGraph(e.target.value)}
//         className="border p-2 rounded"
//       >
//         <option value="bar">Bar Chart</option>
//         <option value="line">Line Chart</option>
//         <option value="pie">Pie Chart</option>
//       </select>
//     </div>
//     <div className="grid gap-4">
//       {selectedGraph === "bar" && (
//         <>
//           <div className="mb-4">
//             <p>Total Income: ${totalIncome.toFixed(2)}</p>
//             <p>Total Spend: ${totalSpend.toFixed(2)}</p>
//           </div>
//           <BarChartSpendVsIncome totalIncome={totalIncome} totalSpend={totalSpend} />
//         </>
//       )}
//       {selectedGraph === "line" && <LineChartComponent totalIncome={totalIncome} totalSpend={totalSpend} />}
//       {selectedGraph === "pie" && <PieChartComponent totalIncome={totalIncome} totalSpend={totalSpend} />}
//     </div>
//   </div>
// );
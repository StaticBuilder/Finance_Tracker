"use client";
import React, { useEffect, useState, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql, and, inArray } from "drizzle-orm";
import { Budgets, Expenses, Incomes, PeriodSelected, Periods } from "../../../../../utils/schema";
import EnhancedUniversalChart from "../_components/graphs/ChartContainer";
import { useRouter } from "next/navigation";
import { ChartWrapper } from "../_components/ChartExport";
import { toast } from "sonner";
import { TimeFrameContext } from "@/components/ui/TimeFrameProvider";


function StatisticsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { selectedTimeFrames } = useContext(TimeFrameContext);
  const [periodNames, setPeriodNames] = useState({});
  const [userEmail, setUserEmail] = useState(null);
  const [selectedComparison, setSelectedComparison] = useState("income-spend");
  const [budgetList, setBudgetList] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [actualSavings, setActualSavings] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("bar");
  const [incomeList, setIncomeList] = useState([]);

  // Fetch period names
  useEffect(() => {
    const fetchPeriodNames = async () => {
      if (selectedTimeFrames && selectedTimeFrames.length > 0) {
        const periodNamesResult = await db
          .select({
            id: Periods.id,
            name: Periods.name
          })
          .from(Periods)
          .where(inArray(Periods.id, selectedTimeFrames));

        const namesMap = periodNamesResult.reduce((acc, period) => {
          acc[period.id] = period.name;
          return acc;
        }, {});

        setPeriodNames(namesMap);
      }
    };

    if (user) {
      fetchPeriodNames();
    }
  }, [user, selectedTimeFrames]);

  // Initial data fetch
  useEffect(() => {
    if (user && selectedTimeFrames && selectedTimeFrames.length > 0) {
      setUserEmail(user.primaryEmailAddress?.emailAddress);
      getBudgetList();
      getIncomeList();
    } else if (user && (!selectedTimeFrames || selectedTimeFrames.length === 0)) {
      // Route to timeframe setup if no period is selected
      router.replace("/dashboard/timeframe");
      toast('Choose A TimeFrame First', {
        duration: 10000,
      });
    }
  }, [user, selectedTimeFrames]);

  useEffect(() => {
    if (incomeList.length > 0 && userEmail) {
      const userIncome = incomeList
        .filter((income) => income.createdBy === userEmail)
        .reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
      setTotalIncome(userIncome);
      console.log('Calculated total income:', userIncome); // Debug log
    }
  }, [incomeList, userEmail]);

  // Income list fetching
  const getIncomeList = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select({
          ...getTableColumns(Incomes),
          periodId: Incomes.periodId,
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),
        })
        .from(Incomes)
        .where(
          and(
            eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress),
            inArray(Incomes.periodId, selectedTimeFrames)
          )
        )
        .groupBy(Incomes.id, Incomes.periodId);

      setIncomeList(result);

      // Calculate total income
      const userIncome = result
        .reduce((sum, income) => sum + (parseFloat(income.amount) || 0), 0);
      setTotalIncome(userIncome);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  // Budget list fetching
  const getBudgetList = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select({
          ...getTableColumns(Budgets),
          periodId: Budgets.periodId,
          totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
            inArray(Budgets.periodId, selectedTimeFrames)
          ))
        .groupBy(Budgets.id, Budgets.periodId)
        .orderBy(desc(Budgets.id));

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
    <div className="p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">User Statistics</h1>
      
      {/* Chart Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="graphType" className="block text-foreground font-medium mb-2">
            Select Chart Type:
          </label>
          <select
            id="graphType"
            value={selectedGraph}
            onChange={(e) => setSelectedGraph(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground p-2 rounded shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div>
          <label htmlFor="comparison" className="block text-foreground font-medium mb-2">
            Select Comparison:
          </label>
          <select
            id="comparison"
            value={selectedComparison}
            onChange={(e) => setSelectedComparison(e.target.value)}
            className="w-full border border-border bg-card text-card-foreground p-2 rounded shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
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
        {[
          { 
            label: "Total Income", 
            value: totalIncome.toLocaleString(), 
            color: "text-green-500",
            className: "bg-green-50/20"
          },
          { 
            label: "Total Spend", 
            value: totalSpend.toLocaleString(), 
            color: "text-destructive",
            className: "bg-destructive/10"
          },
          { 
            label: "Total Budget", 
            value: totalBudget.toLocaleString(), 
            color: "text-orange-500",
            className: "bg-orange-50/20"
          },
          { 
            label: "Expected Savings", 
            value: expectedSavings.toLocaleString(), 
            color: "text-blue-500",
            className: "bg-blue-50/20"
          },
          { 
            label: "Actual Savings", 
            value: actualSavings.toLocaleString(), 
            color: "text-purple-500",
            className: "bg-purple-50/20"
          }
        ].map((card, index) => (
          <div 
            key={card.label} 
            className={`p-4 rounded-lg shadow-sm border border-border ${card.className}`}
          >
            <h3 className="text-sm font-medium text-muted-foreground">{card.label}</h3>
            <p className={`text-lg font-semibold ${card.color}`}>
              Ksh.{card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Display */}
      <div className="bg-card rounded-lg shadow-md border border-border p-6">
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


              
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses, Incomes } from "../../../../utils/schema";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import { Toaster } from "@/components/ui/sonner";
import BarChartComponent from "./_components/graphs/BarChartComponent";
import LineChartComponent from "./_components/graphs/LineChartComponent";
import PieChartComponentB from "./_components/graphs/PieChartComponentB";
import PieChartComponent from "./_components/graphs/PieChartComponent";

function Dashboard() {
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState(null);
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // Array of chart components to rotate through with names
  const charts = [
    { 
      component: BarChartComponent, 
      name: "Bar Chart" 
    },
    { 
      component: LineChartComponent, 
      name: "Line Chart" 
    },
    { 
      component: PieChartComponent, 
      name: "Pie Chart Spend Distribution" 
    },
    { 
      component: PieChartComponentB, 
      name: "Pie Chart Budget Allocation" 
    }
  ];

  useEffect(() => {
    if (user) {
      setUserEmail(user.primaryEmailAddress?.emailAddress);
      getBudgetList();
    }
  }, [user]);

  // Chart rotation effect
  useEffect(() => {
    const chartRotationInterval = setInterval(() => {
      setCurrentChartIndex((prevIndex) => 
        (prevIndex + 1) % charts.length
      );
    }, 20000); // 20 seconds

    // Clean up interval on component unmount
    return () => clearInterval(chartRotationInterval);
  }, []);

  // Rest of your existing methods (getBudgetList, getIncomeList, getAllExpenses)
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
    setBudgetList(result);
    getAllExpenses();
    getIncomeList();
  };

  const getIncomeList = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Incomes),
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(
            Number
          ),
        })
        .from(Incomes)
        .groupBy(Incomes.id);

      setIncomeList(result);
    } catch (error) {
      console.error("Error fetching income list:", error);
    }
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  // Animation variants for chart transitions
  const chartVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      x: 50 // Slide in from right
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: { 
        duration: 0.5,
        type: "tween" 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      x: -50, // Slide out to left
      transition: { 
        duration: 0.5,
        type: "tween" 
      }
    }
  };

  // Get current chart component
  const CurrentChartComponent = charts[currentChartIndex].component;

  return (
    <div className="p-8 bg-">
      <Toaster />
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Here's what happenning with your money, Lets Manage your expense
      </p>

      <CardInfo 
        budgetList={budgetList} 
        incomeList={incomeList} 
        currentUserEmail={userEmail} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2 relative">
          {/* Animated Chart Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChartIndex}
              variants={chartVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              {/* Chart Header */}
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-700">
                  {charts[currentChartIndex].name}
                </h3>
                <div className="flex space-x-2">
                  {charts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChartIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        currentChartIndex === index 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Current Chart */}
              <CurrentChartComponent data={budgetList}/>
            </motion.div>
          </AnimatePresence>

          <ExpenseListTable
            budget={budgetList}
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  key={index}
                  className="h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
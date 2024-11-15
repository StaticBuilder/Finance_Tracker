"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../../../../utils/schema";
import BarChartComponent from "../_components/graphs/BarChartComponent";
import LineChartComponent from "../_components/graphs/LineChartComponent";
import PieChartComponent from "../_components/graphs/PieChartComponent";

function StatisticsPage() {
  const { user } = useUser();
  const [userEmail, setUserEmail] = useState(null);
  const [budgetList, setBudgetList] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState("bar");

  useEffect(() => {
    if (user) {
      setUserEmail(user.primaryEmailAddress?.emailAddress);
      getBudgetList();
    }
  }, [user]);

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
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">User Statistics</h1>
      <div className="mb-6">
        <label htmlFor="graphType" className="block text-gray-700 font-medium mb-2">
          Select Graph Type:
        </label>
        <select
          id="graphType"
          value={selectedGraph}
          onChange={(e) => setSelectedGraph(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>
      <div className="grid gap-4">
        {selectedGraph === "bar" && <BarChartComponent budgetList={budgetList} />}
        {selectedGraph === "line" && <LineChartComponent data={budgetList} />}
        {selectedGraph === "pie" && <PieChartComponent data={budgetList} />}
      </div>
    </div>
  );
}

export default StatisticsPage;

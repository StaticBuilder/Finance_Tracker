"use client";
import React, { useEffect, useState, useContext } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '../../../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql, and, inArray } from 'drizzle-orm'
import { Budgets, Expenses, Periods  } from '../../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TimeFrameContext } from "@/components/ui/TimeFrameProvider";

function BudgetList() {
  const [periodNames, setPeriodNames] = useState({});
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const { selectedTimeFrames } = useContext(TimeFrameContext);

  // Fetch period names when component mounts or selectedTimeFrames change
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

        // Convert to a lookup object for easy access
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

  useEffect(() => {
    if (user && selectedTimeFrames && selectedTimeFrames.length > 0) {
      getBudgetList();
    } else if (user && (!selectedTimeFrames || selectedTimeFrames.length === 0)) {
      // Route to timeframe setup if no period is selected
      router.replace("/dashboard/timeframe");
      toast('Choose A TimeFrame First', {
        duration: 10000,
      });
    }
  }, [user, selectedTimeFrames]);

  const getBudgetList = async () => {
    // Ensure we have selected time frames
    if (!selectedTimeFrames || selectedTimeFrames.length === 0) {
      toast('No Time Frames Selected', {
        duration: 10000,
      });
      return;
    }

    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      periodId: Budgets.periodId // Explicitly include periodId
    }).from(Budgets)
    .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(
      and(
        eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
        inArray(Budgets.periodId, selectedTimeFrames)
      ))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id));

    setBudgetList(result);
  }

  // Function to group budgets by period
  const groupBudgetsByPeriod = () => {
    return selectedTimeFrames.map(periodId => ({
      periodId,
      periodName: periodNames[periodId] || `Period ${periodId}`,
      budgets: budgetList.filter(budget => budget.periodId === periodId)
    }));
  };

  return (
    <div className="mt-7">
      <CreateBudget refreshData={() => getBudgetList()} />
      {selectedTimeFrames.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Please select a time frame to view budgets
        </div>
      ) : (
        groupBudgetsByPeriod().map(periodGroup => (
          <div key={periodGroup.periodId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {periodGroup.periodName}
            </h2>
            <div>
              {periodGroup.budgets.length > 0 ? (
                periodGroup.budgets.map((budget, index) => (
                  <BudgetItem 
                    budget={budget} 
                    key={index} 
                    refreshData={getBudgetList} 
                    className="mb-3"
                  />
                ))
              ) : (
                [1, 2, 3].map((item, index) => (
                  <div
                    key={index}
                    className="w-full bg-orange-250 rounded-lg h-[150px] animate-pulse"
                  ></div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>

  )
}

export default BudgetList
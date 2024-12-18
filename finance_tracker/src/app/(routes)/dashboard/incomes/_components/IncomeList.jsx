"use client";
import React, { useEffect, useState, useContext } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql, and, inArray } from "drizzle-orm";
import { Incomes, Expenses, Periods } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TimeFrameContext } from "@/components/ui/TimeFrameProvider";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [periodNames, setPeriodNames] = useState({});
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
      getIncomelist();
    } else if (user && (!selectedTimeFrames || selectedTimeFrames.length === 0)) {
      // Route to timeframe setup if no period is selected
      router.replace("/dashboard/timeframe");
      toast('Choose A TimeFrame First', {
        duration: 10000,
      });
    }
  }, [user, selectedTimeFrames]);

  const getIncomelist = async () => {
    // Ensure we have selected time frames
    if (!selectedTimeFrames || selectedTimeFrames.length === 0) {
      toast('No Time Frames Selected', {
        duration: 10000,
      });
      return;
    }

    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        periodId: Incomes.periodId, // Include periodId in the result
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(
        and(
          eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress),
          inArray(Incomes.periodId, selectedTimeFrames)
        ))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));

    setIncomelist(result);
  };

  // Function to group incomes by period
  const groupIncomesByPeriod = () => {
    return selectedTimeFrames.map(periodId => ({
      periodId,
      periodName: periodNames[periodId] || `Period ${periodId}`,
      incomes: incomelist.filter(income => income.periodId === periodId)
    }));
  };

  return (
    <div className="mt-7">
      <div className="mb-6">
      <CreateIncomes refreshData={() => getIncomelist()} />
      </div>

      {selectedTimeFrames.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Please select a time frame to view incomes
        </div>
      ) : (
        groupIncomesByPeriod().map(periodGroup => (
          <div key={periodGroup.periodId} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {periodGroup.periodName}
            </h2>
            <div className="mb-8">
              {periodGroup.incomes.length > 0 ? (
                periodGroup.incomes.map((budget, index) => (
                  <IncomeItem 
                    incomeId={budget.id}
                    budget={budget} 
                    key={index} 
                    refreshData={getIncomelist} 
                  />
                ))
              ) : (
                [1, 2, 3].map((item, index) => (
                  <div
                    key={index}
                    className="w-full bg-green-250 rounded-lg h-[150px] animate-pulse"
                  ></div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default IncomeList;
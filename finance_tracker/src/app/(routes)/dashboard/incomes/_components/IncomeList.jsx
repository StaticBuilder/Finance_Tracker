"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "../../../../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql, and } from "drizzle-orm";
import { Incomes, Expenses, PeriodSelected } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    // Fetch the selected period for the user
    const selectedPeriod = await db
    .select()
    .from(PeriodSelected)
    .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress))
    .then(rows => rows[0] || {});

    if (!selectedPeriod.periodId || selectedPeriod == 0) {
      // Route to timeframe setup if no period is selected
      router.replace("/dashboard/timeframe");
      toast('Choose A TimeFrame First', {
        duration: 10000, // Duration in milliseconds (5 seconds)
      });
      return;
    }
    const result = await db
      .select({
        ...getTableColumns(Incomes),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Incomes)
      .leftJoin(Expenses, eq(Incomes.id, Expenses.budgetId))
      .where(
        and(
          eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress),
          eq(selectedPeriod.periodId, Incomes.periodId)
        ))
      .groupBy(Incomes.id)
      .orderBy(desc(Incomes.id));
    setIncomelist(result);
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes refreshData={() => getIncomelist()} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem 
                incomeId={budget.id} // Pass incomeId to IncomeItem
                budget={budget} 
                key={index} 
                refreshData={getIncomelist} 
              />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-green-250 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;

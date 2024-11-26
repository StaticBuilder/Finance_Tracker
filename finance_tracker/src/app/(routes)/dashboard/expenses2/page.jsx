"use client"
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { desc, eq, and, inArray, sql } from 'drizzle-orm';
import React, { useEffect, useState, useContext } from 'react'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from "next/link";
import BudgetList from './_components/ExpenseCategories';
import { TimeFrameContext } from "@/components/ui/TimeFrameProvider";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [noItems, setNoItems] = useState(0);
  
  const { user } = useUser();
  const router = useRouter();
  const { selectedTimeFrames } = useContext(TimeFrameContext);

  // Fetch all expenses
  const getAllExpenses = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
          periodId: Budgets.periodId,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
            inArray(Budgets.periodId, selectedTimeFrames)
          ))
        .orderBy(desc(Expenses.id));

      setExpensesList(result);
      
      // Calculate total spend and number of items
      const totalSpend = result.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
      setTotalSpend(totalSpend);
      setNoItems(result.length);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user && selectedTimeFrames && selectedTimeFrames.length > 0) {
      getAllExpenses();
    } else if (user && (!selectedTimeFrames || selectedTimeFrames.length === 0)) {
      router.replace("/dashboard/timeframe");
      toast('Choose A TimeFrame First', {
        duration: 10000,
      });
    }
  }, [user, selectedTimeFrames]);

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>

      <Link href={"/dashboard/expenses/"}>
        <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] mb-3 mt-3">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl p-3 px-4 bg-orange-500 rounded-full">
                🎁
              </h2>
              <div>
                <h2 className="font-bold md:text-base text-sm">
                  Combined Expenses
                </h2>
                <h2 className="text-sm text-gray-500 md:text-sm text-xs">
                  {noItems} Items
                </h2>
              </div>
            </div>
            <h2 className="font-bold text-primary md:text-lg text-sm">
              Ksh.{totalSpend.toLocaleString()}
            </h2>
          </div>
        </div>
      </Link>
      <BudgetList/>
    </div>
  )
}

export default ExpensesScreen
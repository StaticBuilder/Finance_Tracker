"use client";
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses, PeriodSelected, Periods } from '../../../../../utils/schema';
import { desc, eq, and, inArray, getTableColumns, sql } from 'drizzle-orm';
import { format } from "date-fns";
import React, { useEffect, useState, useContext } from 'react'
import { Calendar, Type } from "lucide-react";
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash } from "lucide-react";
import { toast } from 'sonner';
import { TimeFrameContext } from "@/components/ui/TimeFrameProvider";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const { selectedTimeFrames } = useContext(TimeFrameContext);

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

  const formatDateWithDay = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEE do MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error.message, dateString);
      return "Invalid Date";
    }
  };

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
      getAllExpenses();
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
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

      // Optional: Sort expenses by date across all periods
      const sortedExpenses = result.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setExpensesList(sortedExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl flex'>
      <ArrowLeft onClick={() => router.back()} className="cursor-pointer pr-2 pt-1 " size={32} />My Combined Expenses</h2>
      
      {/* Total Expenses Summary */}
      <div className='mb-4 mt-4'>
        {/* <p className='text-gray-600'>
          Total Expenses: Ksh.{expensesList.reduce((sum, expense) => 
            sum + parseFloat(expense.amount || '0'), 0).toLocaleString()}
        </p> */}
      </div>

      <ExpenseListTable 
        budget={budgetList} 
        refreshData={() => getAllExpenses()}
        expensesList={expensesList}
      />
    </div>
  )
}

export default ExpensesScreen
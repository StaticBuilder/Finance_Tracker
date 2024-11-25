"use client"
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses, PeriodSelected } from '../../../../../utils/schema';
import { desc, eq, and } from 'drizzle-orm';
import { format } from "date-fns";
import React, { useEffect, useState } from 'react'
import { Calendar, Type } from "lucide-react";
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function ExpensesScreen() {

  const [expensesList,setExpensesList]=useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const {user}=useUser();
  const router = useRouter();

  useEffect(()=>{
    user&&getAllExpenses();
  },[user])

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
    /**
   * Used to get All expenses belong to users
   */
    const getAllExpenses = async () => {
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
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(
          and(
            eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
            eq(selectedPeriod.periodId, Budgets.periodId)
          ))
        .orderBy(desc(Expenses.id));
      setExpensesList(result);
    };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>

        <ExpenseListTable budget={budgetList} refreshData={()=>getAllExpenses()}
        expensesList={expensesList}
        />
    </div>
  )
}

export default ExpensesScreen
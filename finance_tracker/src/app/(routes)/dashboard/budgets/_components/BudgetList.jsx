"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '../../../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql, and } from 'drizzle-orm'
import { Budgets, Expenses, PeriodSelected } from '../../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function BudgetList() {

  const [budgetList,setBudgetList]=useState([]);
  const {user}=useUser();
  const router = useRouter();

  useEffect(()=>{
    user&&getBudgetList();
  },[user])
  /**
   * used to get budget List
   */
  const getBudgetList=async()=>{
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

    const result=await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql `sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
    .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(
      and(
        eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress),
        eq(selectedPeriod.periodId, Budgets.periodId)
      ))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id))
    ;

    setBudgetList(result);

  }

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5 '>
        <CreateBudget
        refreshData={()=>getBudgetList()}/>
        {budgetList?.length>0
          ? budgetList.map((budget,index)=>(
            <BudgetItem budget={budget} key={index} />
            ))
          :[1,2,3,4,5].map((item,index)=>(
            <div key={index} className='w-full bg-orange-250 rounded-lg
            h-[150px] animate-pulse'>

            </div> ))
      
        }
        </div>
       
    </div>
  )
}

export default BudgetList
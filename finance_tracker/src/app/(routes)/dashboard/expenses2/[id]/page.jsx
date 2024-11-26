"use client";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../../expenses/_components/AddExpense";
import ExpenseListTable from "../../expenses/_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../../expenses/_components/EditBudget";

// Modify the ExpensesScreen component to correctly access `params` after it's unwrapped
function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  // Fetch budget info when user changes or on component mount
  useEffect(() => {
    if (user && params) {
      // Ensure params.id is unwrapped before usage
      const budgetId = params.id; // `params` might now be a Promise, so await or check its resolved value.
      getBudgetInfo(budgetId);
    }
  }, [user, params]); // Ensure that this effect is run only when `params.id` changes

  /**
   * Get Budget Information
   */
  const getBudgetInfo = async (budgetId) => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, budgetId)) // Use the resolved `budgetId`
        .groupBy(Budgets.id);

      setBudgetInfo(result[0]);
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  /**
   * Get Latest Expenses
   */
  useEffect(() => {
    if (budgetInfo) {
      getExpensesList();
    }
  }, [budgetInfo]); // Trigger only when `budgetInfo` changes

  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id)) // Use the resolved `params.id`
        .orderBy(desc(Expenses.id));

      setExpensesList(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  /**
   * Used to Delete budget
   */
  const deleteBudget = async () => {
    try {
      const deleteExpenseResult = await db
        .delete(Expenses)
        .where(eq(Expenses.budgetId, params.id)) // Use the resolved `params.id`
        .returning();

      if (deleteExpenseResult) {
        const result = await db
          .delete(Budgets)
          .where(eq(Budgets.id, params.id)) // Use the resolved `params.id`
          .returning();
      }
      toast("Budget Deleted!");
      route.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Expenses
        </span>
      </h2>
      <div className="mt-4">
        <ExpenseListTable budget={budgetInfo} expensesList={expensesList} refreshData={() => getBudgetInfo(params.id)} />
      </div>
    </div>
  );
}

export default ExpensesScreen;



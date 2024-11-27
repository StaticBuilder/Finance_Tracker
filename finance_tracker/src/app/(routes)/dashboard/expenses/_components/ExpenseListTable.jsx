import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { Trash, FileDown } from "lucide-react";
import React, { useMemo } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import 'jspdf-autotable';

function ExpenseListTable({ budget, expensesList, refreshData }) {
  const budgetName = budget?.name || "Combined";

  // Sort expenses by date (latest to earliest)
  const sortedExpenses = useMemo(() => {
    return [...expensesList].sort((a, b) => {
      // Parse dates (assuming DD/MM/YYYY format)
      const [dayA, monthA, yearA] = a.createdAt.split('/');
      const [dayB, monthB, yearB] = b.createdAt.split('/');
      
      // Create Date objects for comparison
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      // Sort from latest to earliest (reversed the comparison)
      return dateB - dateA;
    });
  }, [expensesList]);

  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success("Expense Deleted!");
        await refreshData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const exportToPDF = () => {
    if (!budget) {
      toast.error("Budget information not available");
      return;
    }

    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text(`${budgetName} Expense Report`, 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      // Use sorted expenses for PDF export
      const tableRows = sortedExpenses.map(expense => [
        expense.name,
        `Ksh.${expense.amount}`,
        expense.createdAt
      ]);
      
      doc.autoTable({
        startY: 40,
        head: [['Name', 'Amount', 'Date']],
        body: tableRows,
        theme: 'striped',
        headStyles: { 
          fillColor: [66, 66, 66],
          textColor: 255
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 }
        }
      });
      
      const total = sortedExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const finalY = doc.previousAutoTable.finalY || 40;
      doc.setFontSize(12);
      doc.text(`Total Expenses: Ksh.${total.toFixed(2)}`, 14, finalY + 10);
      
      doc.save(`${budgetName} Expenses.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const totalSpent = sortedExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg md:text-lg text-sm text-foreground">{budgetName} Expenses</h2>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg transition-colors duration-200 md:text-base text-sm"
        > 
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-secondary p-2 mt-3">
        <h2 className="font-bold md:text-base text-xs text-secondary-foreground">Name</h2>
        <h2 className="font-bold md:text-base text-xs text-secondary-foreground">Amount</h2>
        <h2 className="font-bold md:text-base text-xs text-center text-secondary-foreground">Date</h2>
        <h2 className="font-bold md:text-base text-xs text-center text-secondary-foreground">Action</h2>
      </div>
      {sortedExpenses.map((expenses) => (
        <div 
          key={expenses.id} 
          className="grid grid-cols-4 bg-card text-card-foreground rounded-bl-xl rounded-br-xl p-2 border-b border-border last:border-b-0"
        >
          <h2 className="md:text-base text-xs">{expenses.name}</h2>
          <h2 className="md:text-base text-xs">Ksh.{expenses.amount}</h2>
          <h2 className="md:text-base text-xs flex justify-center">{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-destructive cursor-pointer flex items-center gap-2 justify-center hover:bg-muted/30 rounded-md p-1 transition-colors"
          >
            <Trash className="md:w-4 md:h-4 w-6 h-6" />
            <span className="md:inline hidden">Delete</span>
          </h2>
        </div>
      ))}
  
      <div className="mt-3 text-right">
        <h2 className="font-bold text-destructive md:text-base text-sm">
          Total Spent: Ksh.{totalSpent.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}

export default ExpenseListTable;
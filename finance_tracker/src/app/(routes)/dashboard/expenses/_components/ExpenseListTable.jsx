import { db } from "../../../../../../utils/dbConfig";
import { Expenses } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { Trash, FileDown } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import 'jspdf-autotable';  // You'll need to install this package

function ExpenseListTable({ expensesList, refreshData }) {
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
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("Expense Report", 14, 22);
      
      // Add timestamp
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      // Prepare the data for the table
      const tableRows = expensesList.map(expense => [
        expense.name,
        `Ksh.${expense.amount}`,
        expense.createdAt
        // new Date(expense.createdAt).toLocaleDateString()
      ]);
      
      // Add the table
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
      
      // Add total at the bottom
      const total = expensesList.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const finalY = doc.previousAutoTable.finalY || 40;
      doc.setFontSize(12);
      doc.text(`Total Expenses: Ksh.${total.toFixed(2)}`, 14, finalY + 10);
      
      // Save the PDF
      doc.save('expense-report.pdf');
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const totalSpent = expensesList.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.map((expenses) => (
        <div key={expenses.id} className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2">
          <h2>{expenses.name}</h2>
          <h2>Ksh.{expenses.amount}</h2>
          <h2>{expenses.createdAt}</h2>
          <h2
            onClick={() => deleteExpense(expenses)}
            className="text-red-500 cursor-pointer flex items-center gap-2"
          >
            <Trash className="w-4 h-4" /> Delete
          </h2>
        </div>
      ))}

      <div className="mt-3 text-right">
          <h2 className="font-bold text-red-600">
            Total Spent: Ksh.{totalSpent.toFixed(2)}
          </h2>
        </div>
      </div>
  );
}

export default ExpenseListTable;
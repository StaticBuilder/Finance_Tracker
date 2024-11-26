import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../../../../../utils/dbConfig"; 
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default date to today when component mounts
  useEffect(() => {
    const today = new Date();
    // Format date as YYYY-MM-DD for input type="date"
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    setLoading(true);
    try {
      // Format the date for database storage
      const formattedDate = moment(date).format("DD/MM/YYYY");
      
      const result = await db
        .insert(Expenses)
        .values({
          name: name,
          amount: amount,
          budgetId: budgetId,
          createdAt: formattedDate,
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        refreshData();
        toast("New Expense Added!");
        // Reset form
        setAmount("");
        setName("");
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Date</h2>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount && date) || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
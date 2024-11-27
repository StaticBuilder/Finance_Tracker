import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../../../../../utils/dbConfig"; 
import { Budgets, Expenses, Periods } from "../../../../../../utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { eq } from 'drizzle-orm';

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [periodDates, setPeriodDates] = useState(null);
  const [validationInfo, setValidationInfo] = useState(null);

  // Fetch period dates when component mounts
  useEffect(() => {
    const fetchPeriodDates = async () => {
      try {
        // First get the budget to find its periodId
        const budget = await db
          .select({ periodId: Budgets.periodId })
          .from(Budgets)
          .where(eq(Budgets.id, budgetId))
          .limit(1);

        if (budget && budget[0]) {
          // Then get the period details
          const period = await db
            .select({
              startDate: Periods.startDate,
              endDate: Periods.endDate
            })
            .from(Periods)
            .where(eq(Periods.id, budget[0].periodId))
            .limit(1);

          if (period && period[0]) {
            setPeriodDates(period[0]);
            console.log("Period dates fetched:", period[0]); // Debug log
          }
        }
      } catch (error) {
        console.error("Error fetching period dates:", error);
        toast.error("Failed to fetch budget period");
      }
    };

    fetchPeriodDates();
  }, [budgetId]);

  // Set default date to today when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  // Update validation info whenever date or periodDates change
  useEffect(() => {
    if (!date || !periodDates) return;

    try {
      const expenseDate = moment(date);
      const startDate = moment(periodDates.startDate, "YYYY-MM-DD");
      const endDate = moment(periodDates.endDate, "YYYY-MM-DD");
      const isValid = expenseDate.isBetween(startDate, endDate, 'day', '[]');

      setValidationInfo({
        expenseDate: expenseDate.format("YYYY-MM-DD"),
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        isValid,
        message: `Date validation: ${isValid ? 'Valid' : 'Invalid'}`
      });

      console.log("Validation check:", { // Debug log
        expenseDate: expenseDate.format("YYYY-MM-DD"),
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        isValid
      });
    } catch (error) {
      console.error("Date validation error:", error);
      setValidationInfo({
        message: "Date validation error",
        error: error.toString(),
        isValid: false
      });
    }
  }, [date, periodDates]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
  };

  const addNewExpense = async () => {
    if (!validationInfo?.isValid) {
      toast.error(
        `Expense date must be between ${periodDates.startDate} and ${periodDates.endDate}`
      );
      return;
    }

    setLoading(true);
    try {
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
        toast.success("New Expense Added!");
        setAmount("");
        setName("");
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

  const isFormValid = () => {
    return name && 
           amount && 
           date && 
           validationInfo?.isValid && 
           !loading;
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
          onChange={handleDateChange}
        />
        {periodDates && (
          <p className="text-sm text-gray-500 mt-1">
            Valid dates: {periodDates.startDate} - {periodDates.endDate}
          </p>
        )}
        {/* Debug information */}
        {/* {validationInfo && (
          <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded">
            <pre>{JSON.stringify(validationInfo, null, 2)}</pre>
          </div>
        )} */}
      </div>
      <Button
        disabled={!isFormValid()}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
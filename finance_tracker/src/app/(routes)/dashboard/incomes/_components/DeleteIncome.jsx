//DeleteIncome.jsx

import React from "react";
import { db } from "../../../../../../utils/dbConfig";
import { Incomes } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

function DeleteIncome({ incomeId, refreshData }) {
  const handleDelete = async () => {
    try {
      const result = await db
        .delete(Incomes)
        .where(eq(Incomes.id, incomeId))
        .returning();

      if (result) {
        refreshData(); // Refresh data to update UI
        toast("Income Deleted!");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast("Failed to delete income. Please try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2 rounded-full" variant="destructive">
          <Trash className="w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this income entry and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteIncome;

"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger  } from "@/components/ui/dialog";
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { db } from "../../../../../../utils/dbConfig";
import { Periods } from "../../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import moment from "moment";

function EditTimeFrame({ periodInfo, refreshData}){
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useUser();

  useEffect(() => {
    if (periodInfo) {
      setName(periodInfo?.name)
      setType(periodInfo?.type)
      setStartDate(periodInfo?.startDate)
      setEndDate(periodInfo?.endDate)
    }
  }, [periodInfo])

  // Helper function to calculate the end date
  const calculateEndDate = (startDate, type) => {
    if (!startDate || !type) return "";
    const start = moment(startDate);
    switch (type) {
      case "weekly":
        return start.add(1, "weeks").format("YYYY-MM-DD");
      case "bi-weekly":
        return start.add(2, "weeks").format("YYYY-MM-DD");
      case "tri-weekly":
        return start.add(3, "weeks").format("YYYY-MM-DD");
      case "monthly":
        return start.add(1, "months").format("YYYY-MM-DD");
      case "2-months":
        return start.add(2, "months").format("YYYY-MM-DD");
      case "3-months":
        return start.add(3, "months").format("YYYY-MM-DD");
      case "4-months":
        return start.add(4, "months").format("YYYY-MM-DD");
      case "5-months":
        return start.add(5, "months").format("YYYY-MM-DD");
      case "6-months":
        return start.add(6, "months").format("YYYY-MM-DD");
      case "7-months":
        return start.add(7, "months").format("YYYY-MM-DD");
      case "8-months":
        return start.add(8, "months").format("YYYY-MM-DD");
      case "9-months":
        return start.add(9, "months").format("YYYY-MM-DD");
      case "10-months":
        return start.add(10, "months").format("YYYY-MM-DD");
      case "11-months":
        return start.add(11, "months").format("YYYY-MM-DD");
      case "yearly":
        return start.add(1, "years").format("YYYY-MM-DD");
      default:
        return "";
    }
  };

  // Handlers for type and start date
  const handleTypeChange = (value) => {
    setType(value);
    if (startDate) {
      setEndDate(calculateEndDate(startDate, value));
    }
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    if (type) {
      setEndDate(calculateEndDate(value, type));
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return "Anonymous";
    if (user.username) return user.username;

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName) return fullName;

    return user.primaryEmailAddress?.emailAddress || "Anonymous";
  };

  const onUpdateTimeframe = async () => {
    const result = await db
      .update(Periods)
      .set({
        name: name,
        type: type,
        startDate: startDate,
        endDate: endDate
      })
      .where(eq(Periods.id, periodInfo.id))
      .returning();

    if (result) {
      refreshData();
      toast(" Time Period Updated!");
    }
  };

  return(
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto flex items-center justify-center space-x-2 gap-2 rounded-full">
          <PenBox className="w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit TimeFrame</DialogTitle>
          <DialogDescription>
            <div className="mt-5 space-y-4">
              <div>
                <h2 className="text-black font-medium my-1">Period Name</h2>
                <Input
                  placeholder="e.g. Q1 2024"
                  defaultValue={periodInfo?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <h2 className="text-black font-medium my-1">Period Type</h2>
                <Select defaultValue={periodInfo?.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">2 Weeks</SelectItem>
                    <SelectItem value="tri-weekly">3 weeks</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="2-months">2 Months</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="4-months">4 Months</SelectItem>
                    <SelectItem value="5-months">5 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="7-months">7 Months</SelectItem>
                    <SelectItem value="8-months">8 Months</SelectItem>
                    <SelectItem value="9-months">9 Months</SelectItem>
                    <SelectItem value="10-months">10 Months</SelectItem>
                    <SelectItem value="11-months">11 Months</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h2 className="text-black font-medium my-1">Start Date</h2>
                <Input
                  type="date"
                  defaultValue={periodInfo?.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>

              <div>
                <h2 className="text-black font-medium my-1">End Date</h2>
                <Input
                  type="date"
                  value={endDate}
                  readOnly
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(name && type && startDate && endDate)}
              onClick={() => onUpdateTimeframe()}
              className="mt-5 w-full rounded-full"
            >
              Edit Time Period
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTimeFrame;
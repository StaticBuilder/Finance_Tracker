"use client";
import React, { useState } from "react";
import moment from "moment";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "../../../../../../utils/dbConfig";
import { Periods } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function CreateTimeFrame({ refreshData }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useUser();

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

  // Create a new time period
  const onCreateTimeframe = async () => {
    const result = await db
      .insert(Periods)
      .values({
        name: name,
        type: type,
        startDate: startDate,
        endDate: endDate,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DDTHH:mm:ss"),
      })
      .returning({ insertedId: Periods.id });

    if (result) {
      refreshData();
      toast("New Time Period Created!");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-purple-500 p-10 rounded-2xl items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md animate-pulse"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Time Period</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Time Period</DialogTitle>
            <DialogDescription>
              <div className="mt-5 space-y-4">
                <div>
                  <h2 className="text-black font-medium my-1">Period Name</h2>
                  <Input
                    placeholder="e.g. Q1 2024"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <h2 className="text-black font-medium my-1">Period Type</h2>
                  <Select onValueChange={handleTypeChange}>
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
                onClick={() => onCreateTimeframe()}
                className="mt-5 w-full rounded-full"
              >
                Create Time Period
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

}
export default CreateTimeFrame;
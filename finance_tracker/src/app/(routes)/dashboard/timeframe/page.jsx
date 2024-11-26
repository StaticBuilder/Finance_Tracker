"use client"
import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/dbConfig";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { Periods } from "../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import CreateTimeFrame from "./_components/CreateTimeFrame";
import { toast } from "sonner";
import TimeFramesCreated from "./_components/TimeFrameCreated";
import SelectAllButton from "./_components/SelectAllButton";


function TimeFrame() {
  const [periodList, setPeriodlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const getPeriodList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Periods),
        })
        .from(Periods)
        .where(eq(Periods.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Periods.createdAt));

      // Sort periods by createdAt in descending order (newest first)
      const sortedPeriods = result.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      setPeriodlist(sortedPeriods);
    } catch (error) {
      console.error("Error fetching periods:", error);
      toast.error("Failed to load time frames");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getPeriodList();
    }
  }, [user?.primaryEmailAddress?.emailAddress,]);

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="w-full bg-orange-250 rounded-lg h-[150px] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Create New TimeFrame Button */}
      <div className="mb-6">
        <CreateTimeFrame refreshData={getPeriodList} />
      </div>

      <div className="mb-4">
        <SelectAllButton periods={periodList} />
      </div>

      {/* Time Frames Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TimeFramesCreated periods={periodList} refreshData={getPeriodList} />
      </div>
    </div>
  );
}

export default TimeFrame;

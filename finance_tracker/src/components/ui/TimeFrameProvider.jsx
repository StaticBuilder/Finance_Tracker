"use client";
import React, { createContext, useState, useEffect } from 'react';
import { db } from '../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { PeriodSelected } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';

export const TimeFrameContext = createContext();

export const TimeFrameProvider = ({ children }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchSelectedPeriod = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    try {
      const result = await db
        .select({
          periodId: PeriodSelected.periodId,
        })
        .from(PeriodSelected)
        .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress,));

      if (result && result.length > 0) {
        const periodId = Number(result[0].periodId);
        setSelectedTimeFrame(periodId);
        console.log('Fetched periodId from DB:', periodId);
      } else {
        setSelectedTimeFrame(null);
        console.log('No period selected in DB');
      }
    } catch (error) {
      console.error('Error fetching selected period:', error);
      setSelectedTimeFrame(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount - now depends on user
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchSelectedPeriod();
    }
  }, [user?.primaryEmailAddress?.emailAddress]); // Add user as dependency

  const updateSelectedTimeFrame = async (newTimeFrameId) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      if (newTimeFrameId === null) {
        await db
          .delete(PeriodSelected)
          .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress,));
        
        setSelectedTimeFrame(null);
        console.log('Cleared selected period');
      } else {
        const existing = await db
          .select()
          .from(PeriodSelected)
          .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress));

        if (existing.length > 0) {
          await db
            .update(PeriodSelected)
            .set({
              periodId: newTimeFrameId,
              updatedAt: new Date().toISOString()
            })
            .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress));
        } else {
          await db.insert(PeriodSelected).values({
            createdBy: user?.primaryEmailAddress?.emailAddress,
            periodId: newTimeFrameId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        setSelectedTimeFrame(newTimeFrameId);
        console.log('Updated selected period to:', newTimeFrameId);
      }
    } catch (error) {
      console.error('Error updating selected period:', error);
      throw error;
    }
  };

  return (
    <TimeFrameContext.Provider 
      value={{ 
        selectedTimeFrame,
        setSelectedTimeFrame: updateSelectedTimeFrame,
        isLoading
      }}
    >
      {children}
    </TimeFrameContext.Provider>
  );
};

export default TimeFrameProvider;
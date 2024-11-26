"use client";
import React, { createContext, useState, useEffect } from 'react';
import { db } from '../../../utils/dbConfig';
import { eq } from 'drizzle-orm';
import { PeriodSelected } from '../../../utils/schema';
import { useUser } from '@clerk/nextjs';

export const TimeFrameContext = createContext({
  selectedTimeFrames: [],
  setSelectedTimeFrames: () => {
    console.warn('setSelectedTimeFrames called without provider');
  },
  isLoading: true
});

export const TimeFrameProvider = ({ children }) => {
  const [selectedTimeFrames, setSelectedTimeFrames] = useState([]);
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
        .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress));

      if (result && result.length > 0) {
        const periodIds = result.map(r => Number(r.periodId));
        setSelectedTimeFrames(periodIds);
        console.log('Fetched periodIds from DB:', periodIds);
      } else {
        setSelectedTimeFrames([]);
        console.log('No periods selected in DB');
      }
    } catch (error) {
      console.error('Error fetching selected period:', error);
      setSelectedTimeFrames([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount - now depends on user
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchSelectedPeriod();
    }
  }, [user?.primaryEmailAddress?.emailAddress]);

  const updateSelectedTimeFrames = async (timeFrameId) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const isSelected = selectedTimeFrames.includes(timeFrameId);
      
      if (isSelected) {
        // Remove the selection
        await db
          .delete(PeriodSelected)
          .where(eq(PeriodSelected.createdBy, user?.primaryEmailAddress?.emailAddress))
          .where(eq(PeriodSelected.periodId, timeFrameId));
        
        setSelectedTimeFrames(prev => prev.filter(id => id !== timeFrameId));
        console.log('Removed period selection:', timeFrameId);
      } else {
        // Add new selection
        await db.insert(PeriodSelected).values({
          createdBy: user?.primaryEmailAddress?.emailAddress,
          periodId: timeFrameId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        setSelectedTimeFrames(prev => [...prev, timeFrameId]);
        console.log('Added new period selection:', timeFrameId);
      }
    } catch (error) {
      console.error('Error updating selected periods:', error);
      throw error;
    }
  };

  return (
    <TimeFrameContext.Provider 
      value={{ 
        selectedTimeFrames,
        setSelectedTimeFrames: updateSelectedTimeFrames, // Changed this line
        isLoading
      }}
    >
      {children}
    </TimeFrameContext.Provider>
  );
};

export default TimeFrameProvider;
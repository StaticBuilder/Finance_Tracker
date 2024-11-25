"use client";

import React, { useState, createContext, useContext, useEffect } from 'react';
import { format } from "date-fns";
import { Calendar, Type } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DeleteTimeFrame from './DeleteTimeFrame';
import EditTimeFrame from './EditTimeFrame';
import { TimeFrameContext } from '@/components/ui/TimeFrameProvider';

const TimeFramesCreated = ({ periods, refreshData }) => {
  const { selectedTimeFrame, setSelectedTimeFrame } = useContext(TimeFrameContext);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('select'); // 'select' or 'unselect'
  const [isUpdating, setIsUpdating] = useState(false);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('Current selectedTimeFrame:', selectedTimeFrame);
    console.log('Current selectedPeriodId:', selectedPeriodId);
  }, [selectedTimeFrame, selectedPeriodId]);

  const formatDateWithDay = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEE do MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error.message, dateString);
      return "Invalid Date";
    }
  };

  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId);

  const handleDialogOpen = (periodId) => {
    setSelectedPeriodId(periodId);
  };

  const handleDialogClose = () => {
    setSelectedPeriodId(null);
    setShowAlert(false);
  };

  const formatCreatedAt = (dateString) => {
    try {
      if (!dateString) throw new Error('Invalid date string');
      const date = new Date(dateString);
  
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
  
      return format(date, 'EEE do MMM yyyy HH:mm');
    } catch (error) {
      console.error('Error formatting createdAt:', error.message);
      return 'Invalid Date';
    }
  };

  const handleChoose = () => {
    // If this timeframe is already selected, show unselect alert
    if (selectedTimeFrame === selectedPeriodId) {
      setAlertType('unselect');
    } else {
      setAlertType('select');
    }
    setShowAlert(true);
  };

  const handleConfirmChoice = async () => {
    setIsUpdating(true);
    try {
      if (alertType === 'unselect') {
        await setSelectedTimeFrame(null);
      } else {
        // Ensure periodId is passed as a number
        await setSelectedTimeFrame(Number(selectedPeriodId));
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error updating timeframe selection:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <>
      {periods.map((period) => (
        <Card 
          key={period.id} 
          className={`w-full transition-all duration-300 ${
            selectedTimeFrame === period.id 
              ? 'ring-2 ring-purple-500 ring-opacity-50 shadow-lg animate-pulse'
              : 'hover:shadow-lg'
          }`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Header with name and type */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <span>{period.name}</span>
                  {selectedTimeFrame === period.id && (
                    <span className="text-sm text-purple-600 font-medium">(Selected)</span>
                  )}
                </h3>
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 capitalize">{period.type}</span>
                </div>
              </div>

              {/* Dates section */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {formatDateWithDay(period.startDate)}
                    </span>
                    <span>-</span>
                    <span className="text-sm font-medium">
                      {formatDateWithDay(period.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Created info */}
              <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                <span>Created by {period.createdBy}</span>
                <span>{formatCreatedAt(period.createdAt)}</span>
              </div>

              {/* Open Dialog Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => handleDialogOpen(period.id)}
                    variant={selectedTimeFrame === period.id ? "secondary" : "default"}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                {selectedPeriod && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{selectedPeriod.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Start Date: {formatDateWithDay(selectedPeriod.startDate)}</p>
                      <p>End Date: {formatDateWithDay(selectedPeriod.endDate)}</p>
                    </div>
                    <DialogFooter>
                    <Button 
                        onClick={handleChoose}
                        variant={selectedTimeFrame === period.id ? "secondary" : "default"}
                      >
                        {selectedTimeFrame === period.id ? 'Unselect TimeFrame' : 'Choose TimeFrame'}
                      </Button>
                      <EditTimeFrame periodInfo={period} refreshData={refreshData} />
                      <DeleteTimeFrame periodId={selectedPeriodId} refreshData={refreshData} />
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Alert Dialog */}
              <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{alertType === 'select' ? 'Choose Time Frame' : 'Unselect Time Frame'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {alertType === 'select' ? (
                        "By selecting this time frame, all data (incomes, expenses, and budgets) will be filtered to show only entries within this period. Are you sure you want to continue?"
                      ) : (
                        "By unselecting this time frame, you will see all data across all time periods. Are you sure you want to continue?"
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleConfirmChoice}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Continue'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default TimeFramesCreated;
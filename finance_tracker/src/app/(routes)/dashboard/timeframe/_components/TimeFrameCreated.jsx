"use client";

import React, { useState, useContext, useEffect } from 'react';
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
  const { selectedTimeFrames = [], setSelectedTimeFrames: updateSelectedTimeFrames  } = useContext(TimeFrameContext);
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
    setShowAlert(true);
  };

  const handleConfirmChoice = async () => {
    setIsUpdating(true);
    try {
      await updateSelectedTimeFrames(selectedPeriodId);
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
            (selectedTimeFrames || []).includes(period.id) 
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
                  {(selectedTimeFrames || []).includes(period.id) && (
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
                    variant={(selectedTimeFrames || []).includes(period.id) ? "secondary" : "default"}
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
                    <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <Button 
                        onClick={handleChoose}
                        variant={(selectedTimeFrames || []).includes(period.id) ? "secondary" : "default"}
                        className="w-full sm:w-auto"
                      >
                        {(selectedTimeFrames || []).includes(period.id) ? 'Remove Selection' : 'Add Selection'}
                      </Button>
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <EditTimeFrame periodInfo={period} refreshData={refreshData} />
                        <DeleteTimeFrame periodId={selectedPeriodId} refreshData={refreshData} />
                      </div>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Alert Dialog */}
              <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {(selectedTimeFrames || []).includes(selectedPeriodId) 
                        ? 'Remove Time Frame' 
                        : 'Add Time Frame'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    {(selectedTimeFrames || []).includes(selectedPeriodId)
                      ? "Are you sure you want to remove this time frame from your selection?"
                      : "Are you sure you want to add this time frame to your selection?"}
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
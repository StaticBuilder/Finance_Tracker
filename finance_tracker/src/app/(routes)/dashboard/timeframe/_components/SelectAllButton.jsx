import React, { useContext, useState, useEffect } from 'react';
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
import { TimeFrameContext } from '@/components/ui/TimeFrameProvider';

const SelectAllButton = ({ periods }) => {
  const { selectedTimeFrames, setSelectedTimeFrames } = useContext(TimeFrameContext);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(true);

  // Update button state based on selected periods
  useEffect(() => {
    setIsSelectAll(selectedTimeFrames.length === 0);
  }, [selectedTimeFrames]);

  const handleClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    try {
      if (isSelectAll) {
        // Select all periods
        for (const period of periods) {
          if (!selectedTimeFrames.includes(period.id)) {
            await setSelectedTimeFrames(period.id);
          }
        }
      } else {
        // Unselect all periods
        for (const period of periods) {
          if (selectedTimeFrames.includes(period.id)) {
            await setSelectedTimeFrames(period.id);
          }
        }
      }
    } catch (error) {
      console.error('Error updating selections:', error);
    }
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        variant={isSelectAll ? "default" : "destructive"}
        onClick={handleClick}
        className="w-full md:w-auto"
      >
        {isSelectAll ? "Select All Periods" : "Unselect All Periods"}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSelectAll ? "Select All Periods" : "Unselect All Periods"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSelectAll 
                ? "Are you sure you want to select all periods?"
                : "Are you sure you want to unselect all periods?"
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SelectAllButton;
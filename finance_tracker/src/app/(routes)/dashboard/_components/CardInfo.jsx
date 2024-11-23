import React, { useEffect, useState } from "react";
import formatNumber from "../../../../../utils";
import getFinancialAdvice from "../../../../../utils/getFinancialAdvice";
import { Sparkles, CreditCard, ShoppingCart, List, TrendingUp, ArrowDownCircle, ArrowUpCircle, ShieldCheck } from 'lucide-react';
import financialAdviceData from "@/app/financialAdviceData";

function CardInfo({ budgetList, incomeList, currentUserEmail }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [actualSavings, setActualSavings] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  // Function to get spend card style based on conditions
  const getSpendCardStyle = (card) => {
    if (card.label === "Total Spend") {
      if (totalSpend > totalIncome) {
        return "bg-gradient-to-r from-red-400 via-red-500 to-red-600 animate-bounce";
      }
      if (totalSpend > totalBudget) {
        return "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-pulse";
      }
      return "bg-gradient-to-r from-green-400 via-green-500 to-green-600";
    }
    // Return fixed gradient for each card
    switch (card.label) {
      case "Total Budget":
        return "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600";
      case "Sum of Income Streams":
        return "bg-gradient-to-r from-green-400 via-green-500 to-green-600";
      case "No. of Budget":
        return "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600";
      case "Expected Savings":
        return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600";
      case "Actual Savings":
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500";
      default:
        return "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600";
    }
  };

  useEffect(() => {
    if (incomeList.length && currentUserEmail) {
      const userIncome = incomeList
        .filter((income) => income.createdBy === currentUserEmail)
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
      setTotalIncome(userIncome);
    }
  }, [incomeList, currentUserEmail]);

  const calculateCardInfo = (income) => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ += parseFloat(element.amount || 0);
      totalSpend_ += parseFloat(element.totalSpend || 0);
    });

    const expectedSavings_ = income - totalBudget_;
    const actualSavings_ = income - totalSpend_;

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    setExpectedSavings(expectedSavings_);
    setActualSavings(actualSavings_);
  };

  // Function to determine the scenario
  function determineScenario(totalBudget, totalSpend, totalIncome) {
    if (totalIncome > totalBudget && totalBudget > totalSpend) {
      return "scenario1"; // Income > Budget > Spend
    } else if (totalBudget > totalIncome && totalIncome > totalSpend) {
      return "scenario2"; // Budget > Income > Spend
    } else if (totalSpend > totalBudget && totalSpend < totalIncome) {
      return "scenario3"; // Spend > Budget but Spend < Income
    } else if (totalSpend > totalIncome && totalSpend > totalBudget) {
      return "scenario4"; // Spend > Income and Spend > Budget
    } else if (totalIncome > totalSpend && totalSpend > totalBudget) {
      return "scenario5"; // Income > Spend > Budget
    } else if (totalIncome === totalBudget && totalSpend < totalIncome) {
      return "scenario6"; // Income = Budget > Spend
    } else if (totalIncome === totalSpend && totalSpend > totalBudget) {
      return "scenario7"; // Income = Spend > Budget
    } else if (totalSpend === totalBudget && totalIncome < totalSpend) {
      return "scenario8"; // Spend = Budget > Income
    } else if (totalIncome === totalSpend && totalSpend === totalBudget) {
      return "scenario9"; // Income = Budget = Spend
    } else if (totalSpend > totalIncome && totalSpend < totalBudget)  {
      return "scenario10"; // Spend > Budget > Income
    }else if (totalSpend > totalIncome && totalIncome === totalBudget)  {
      return "scenario11"; // Spend > Budget > Income
    } else {
      return "unknownScenario"; // For any unexpected input or edge cases
    }
  }

  // Function to alternate advice every 3 minutes
  function provideAdvice(totalBudget, totalSpend, totalIncome) {
    const scenario = determineScenario(totalBudget, totalSpend, totalIncome);

    if (!scenario || !financialAdviceData[scenario] || financialAdviceData[scenario].length === 0) {
      setFinancialAdvice("Unable to determine scenario or no advice available.");
      return;
    }

    const adviceArray = financialAdviceData[scenario];
    let index = 0;

    // Display the first advice immediately
    setFinancialAdvice(adviceArray[0]);

    // Set an interval to alternate advice every 3 minutes (180,000 ms)
    const intervalId = setInterval(() => {
      index = (index + 1) % adviceArray.length; // Loop through advice
      setFinancialAdvice(adviceArray[index]);
    }, 20000);

    // Optional: Stop the interval after a certain duration (e.g., 12 minutes)
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("Advice rotation stopped.");
    }, 720000); // 12 minutes in milliseconds
  }

  // Example Usage:
  //provideAdvice(5000, 3000, 8000); // Replace with actual data

  useEffect(() => {
    if (totalIncome > 0 || budgetList.length > 0) {
      calculateCardInfo(totalIncome);
    }
  }, [totalIncome, budgetList]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      provideAdvice(totalBudget, totalSpend, totalIncome)
    }
  }, [totalBudget, totalIncome, totalSpend]);

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex mb-2 flex-row space-x-1 items-center">
                <h2 className="text-md">Finance Tracker Advisor</h2>
                <ShieldCheck className="rounded-full text-white w-10 h-10 p-2 bg-gradient-to-r from-green-400 via-green-500 to-green-700 background-animate" />
              </div>
              <h2 className="font-light text-md">
                {financialAdvice || "Loading financial advice..."}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Total Budget", value: formatNumber(totalBudget), icon: CreditCard },
              { label: "Total Spend", value: formatNumber(totalSpend), icon: ShoppingCart },
              { label: "No. of Budget", value: budgetList?.length, icon: List },
              { label: "Sum of Income Streams", value: formatNumber(totalIncome), icon: TrendingUp },
              { label: "Expected Savings", value: formatNumber(expectedSavings), icon: ArrowDownCircle },
              { label: "Actual Savings", value: formatNumber(actualSavings), icon: ArrowUpCircle },
            ].map((card, index) => (
              <div
                key={index}
                className={`p-7 border rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-105 
                  ${getSpendCardStyle(card)} shadow-lg hover:shadow-xl`}
              >
                <div>
                  <h2 className="text-sm text-white opacity-90">{card.label}</h2>
                  <h2 className="font-bold text-2xl text-white">
                    Ksh.{card.value}
                  </h2>
                </div>
                <card.icon className="p-3 h-12 w-12 rounded-full text-white opacity-90" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;
import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  const getTextColor = () => {
    const perc = calculateProgressPerc();
    if (perc >= 75) return "text-red-500"; // Red for 75% and above
    if (perc >= 50) return "text-orange-500"; // Orange for 50% and above
    return "text-slate-400"; // Default neutral color
  };

  const getProgressBarColor = () => {
    const perc = calculateProgressPerc();
    if (perc >= 75) return "bg-red-500"; // Red for 75% and above
    if (perc >= 50) return "bg-orange-500"; // Orange for 50% and above
    return "bg-primary"; // Default color
  };

  const shouldBounce = () => {
    return calculateProgressPerc() >= 75; // Add bounce animation for 75% and above
  };

  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div
        className="p-5 border rounded-2xl
        hover:shadow-md cursor-pointer h-[170px] mb-3"
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2
              className="text-2xl p-3 px-4
              bg-orange-500 rounded-full"
            >
              {budget?.icon}
            </h2>
            <div>
              <h2 className="font-bold md:text-base text-sm">{budget.name}</h2> {/* Added responsive text */}
              <h2 className="text-sm text-gray-500 md:text-sm text-xs">{budget.totalItem} Items</h2> {/* Added responsive text */}
            </div>
          </div>
          <h2 className="font-bold text-primary md:text-lg text-sm"> {/* Added responsive text */}
            Ksh.{budget.amount}
          </h2>
        </div>
  
        <div className={`mt-7 ${shouldBounce() ? "animate-bounce" : ""}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`md:text-xs text-[10px] ${getTextColor()}`}> {/* Added responsive text */}
              Ksh.{budget.totalSpend ? budget.totalSpend : 0} Spend
            </h2>
            <h2 className={`md:text-xs text-[10px] ${getTextColor()}`}> {/* Added responsive text */}
              Ksh.{budget.amount - budget.totalSpend} Remaining
            </h2>
          </div>
          <div
            className="w-full 
            bg-slate-300 h-2 rounded-full"
          >
            <div
              className={`${getProgressBarColor()} h-2 rounded-full`}
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;

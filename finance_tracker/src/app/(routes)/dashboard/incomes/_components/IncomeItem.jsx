import React from "react";
import EditIncome from "./EditIncome";
import DeleteIncome from "./DeleteIncome";

function IncomeItem({ incomeId, budget, refreshData }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] mb-3">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="md:text-2xl text-xl p-3 px-3 bg-green-600 rounded-full"> {/* Reduced icon size */}
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold md:text-base text-sm">{budget.name}</h2> {/* Reduced name size */}
            <h2 className="md:text-sm text-xs text-gray-500">{budget.totalItem} Item</h2> {/* Reduced item count size */}
          </div>
        </div>
        <h2 className="font-bold text-primary md:text-lg text-sm">Ksh.{budget.amount}</h2> {/* Reduced amount size */}
      </div>
  
      <div className="flex items-center justify-between mt-12">
        {/* If EditIncome and DeleteIncome have text, you might want to adjust those components too */}
        <div className="md:scale-100 scale-90"> {/* Slightly reduce button size on mobile */}
          <EditIncome incomeInfo={budget} refreshData={refreshData} />
        </div>
        <div className="md:scale-100 scale-90"> {/* Slightly reduce button size on mobile */}
          <DeleteIncome incomeId={incomeId} refreshData={refreshData} />
        </div>
      </div>
    </div>
  );
}

export default IncomeItem;

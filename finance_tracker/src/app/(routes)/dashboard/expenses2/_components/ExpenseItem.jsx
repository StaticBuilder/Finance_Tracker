import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  return (
    <Link href={"/dashboard/expenses2/" + budget?.id}>
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
      </div>
    </Link>
  );
}

export default BudgetItem;

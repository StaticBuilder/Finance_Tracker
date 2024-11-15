import React from "react";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  PieChart
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function SideNav1({ closeSideNav }) {
  const { user } = useUser();
  const path = usePathname();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard", color: "text-green-800", hoverColor: "hover:bg-green-300" },
    { id: 2, name: "Incomes", icon: CircleDollarSign, path: "/dashboard/incomes", color: "text-green-500", hoverColor: "hover:bg-green-100" },
    { id: 3, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets", color: "text-orange-500", hoverColor: "hover:bg-orange-100" },
    { id: 4, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses", color: "text-red-500", hoverColor: "hover:bg-red-100" },
    { id: 5, name: "User - Statistics", icon: PieChart, path: "/dashboard/expenses", color: "text-blue-500", hoverColor: "hover:bg-blue-100" }
  ];

  return (
    <div className=" p-5 border shadow-sm flex flex-col items-center">
      {/* User button at the top */}
      <div className="mb-8 flex flex-col items-center">
        <UserButton afterSignOutUrl="/" />
        <span className="text-lg font-bold mt-2">{user?.fullName}</span>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col items-center gap-4 w-full">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex gap-4 items-center
                font-semibold text-lg
                p-4 cursor-pointer rounded-lg w-full text-center
                ${menu.color} ${menu.hoverColor}
                ${path === menu.path ? menu.color + " bg-opacity-20" : ""}
              `}
              onClick={closeSideNav}
            >
              <menu.icon className={`w-6 h-6 ${menu.color}`} />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav1;

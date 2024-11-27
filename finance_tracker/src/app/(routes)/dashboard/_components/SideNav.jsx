import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PieChart,
  Clock,
  ShoppingCart, List, TrendingDown,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function SideNav({ closeSideNav }) {
  const { user } = useUser();
  const path = usePathname();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard", color: "text-green-800", hoverColor: "hover:bg-green-300" },
    { id: 2, name: "Timeframe", icon: Clock, path: "/dashboard/timeframe", color: "text-purple-500", hoverColor: "hover:bg-purple-100" },
    { id: 3, name: "Incomes", icon: TrendingDown, path: "/dashboard/incomes", color: "text-green-500", hoverColor: "hover:bg-green-100" },
    { id: 4, name: "Budgets", icon: List, path: "/dashboard/budgets", color: "text-orange-500", hoverColor: "hover:bg-orange-100" },
    { id: 5, name: "Expenses", icon: ShoppingCart, path: "/dashboard/expenses2", color: "text-red-500", hoverColor: "hover:bg-red-100" },
    { id: 6, name: "User - Statistics", icon: PieChart, path: "/dashboard/statistics", color: "text-blue-500", hoverColor: "hover:bg-blue-100" }
   ];

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Link href={"/dashboard"}>
        <div className="flex flex-row items-center" onClick={closeSideNav}>
          <Image src={"./moneya.svg"} alt="logo" width={40} height={25} />
          <span className="font-bold text-xl" style={{ color: "#4CAF50" }}>
            Finance Tracker
          </span>
        </div>
      </Link>

      <div className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex gap-2 items-center
                font-medium
                mb-2 p-4 cursor-pointer rounded-full
                ${menu.color} ${menu.hoverColor}
                ${path === menu.path ? menu.color + " bg-opacity-10" : ""}
              `}
              onClick={closeSideNav}
            >
              <menu.icon className={menu.color} />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton afterSignOutUrl='/' />
        {user?.fullName}
      </div>
    </div>
  );
}

export default SideNav;

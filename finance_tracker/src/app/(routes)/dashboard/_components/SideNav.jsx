import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function SideNav() {
  const { user } = useUser();

  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
      color: "text-green-500", // green for Dashboard
      hoverColor: "hover:bg-green-100",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
      color: "text-green-500", // green for Incomes
      hoverColor: "hover:bg-green-100",
    },
    {
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
      color: "text-orange-500", // orange for Budgets
      hoverColor: "hover:bg-orange-100",
    },
    {
      id: 4,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
      color: "text-red-500", // red for Expenses
      hoverColor: "hover:bg-red-100",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Link href={"/dashboard"}>
        <div className="flex flex-row items-center">
          <Image src={"./moneya.svg"} alt="logo" width={40} height={25} />
          <span className="font-bold text-xl" style={{ color: "#4CAF50" }}>
            Finance Tracker
          </span>
        </div>
      </Link>
      
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center
                text-gray-500 font-medium
                mb-2 p-4 cursor-pointer rounded-full
                ${menu.color} ${menu.hoverColor}
                ${path === menu.path ? menu.color + " bg-opacity-10" : ""}
              `}
            >
              <menu.icon className={menu.color} />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        {user?.fullName}
      </div>
    </div>
  );
}

export default SideNav;
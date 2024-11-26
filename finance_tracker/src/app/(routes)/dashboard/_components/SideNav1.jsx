import React from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  PieChart,
  Clock
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
    { id: 2, name: "Timeframe", icon: Clock, path: "/dashboard/timeframe", color: "text-purple-500", hoverColor: "hover:bg-purple-100" },
    { id: 3, name: "Incomes", icon: CircleDollarSign, path: "/dashboard/incomes", color: "text-green-500", hoverColor: "hover:bg-green-100" },
    { id: 4, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets", color: "text-orange-500", hoverColor: "hover:bg-orange-100" },
    { id: 5, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses2", color: "text-red-500", hoverColor: "hover:bg-red-100" },
    { id: 6, name: "User - Statistics", icon: PieChart, path: "/dashboard/statistics", color: "text-blue-500", hoverColor: "hover:bg-blue-100" }
   ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1, 
      x: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  // Individual menu item animation variants
  const menuItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  return (
    <motion.div 
      className="p-5 border shadow-sm flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation links */}
      <motion.div 
        className="flex flex-col items-center gap-4 w-full"
      >
        {menuList.map((menu) => (
          <motion.div
            key={menu.id}
            variants={menuItemVariants}
            whileHover="hover"
          >
            <Link href={menu.path}>
              <motion.div
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
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default SideNav1;
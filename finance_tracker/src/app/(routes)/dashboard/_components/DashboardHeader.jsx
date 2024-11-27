import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import SideNav1 from './SideNav1';
import { Menu } from 'lucide-react'; // Import the Menu icon
import { useUser } from '@clerk/nextjs';

function DashboardHeader() {
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);
  const { user } = useUser();

  const toggleSideNav = () => {
    setIsSideNavVisible(!isSideNavVisible);
  };

  return (
    <>
      <div className="p-5 shadow-sm border-b flex justify-between">
        {/* Replace "Navigation" text with Menu icon */}
        <div
          onClick={toggleSideNav}
          className="cursor-pointer p-4 rounded-full hover:bg-gray-300 active:bg-gray-500 transition-colors duration-200"
        >
          <Menu size={24} /> {/* Adjust the size as needed */}
        </div>
        <div className=" p-5 flex gap-2 items-center text-white-600">
        <UserButton afterSignOutUrl='/' />
        {user?.fullName}
      </div>
      </div>

      {/* Pass close function to SideNav */}
      {isSideNavVisible && <SideNav1 closeSideNav={() => setIsSideNavVisible(false)} />}
    </>
  );
}

export default DashboardHeader;

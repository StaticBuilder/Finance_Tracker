"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if signed in
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="p-5 flex justify-center items-center border shadow-sm bg-white">
  <div className="flex flex-row items-center">
    <Image src={"./moneya.svg"} alt="logo" width={60} height={40} />
    <span className="font-bold text-2xl ml-3" style={{ color: '#4CAF50' }}>Finance Tracker</span>
  </div>
</div>
  );
}

export default Header;

"use client";

import { SignIn } from "@clerk/nextjs";
import React from "react";
import ImageCarousel from "./ImageCarousel";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <ImageCarousel />
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl ">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <img
                  src="../../favicon.ico"
                  alt="Home"
                  className="w-12 h-12 "
                />
              </a>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to Finance Tracker 💸💰🪙💴
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
              Take control of your finances with ease! Track your income, expenses, and budgets effortlessly while planning for a brighter financial future.
              </p>
            </div>
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}

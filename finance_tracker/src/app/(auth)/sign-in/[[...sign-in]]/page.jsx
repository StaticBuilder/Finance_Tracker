"use client"
import { SignIn } from "@clerk/nextjs";
import React from "react";
import ImageCarousel from "./ImageCarousel";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">

        <ImageCarousel /> 
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <svg
                    height="100px"
                    width="100px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                  >
                    <path
                      style={{ fill: "#FFEBBE" }}
                      d="M344.276,512H167.724c-48.754,0-88.276-39.522-88.276-88.276V317.793 c0-97.506,79.044-176.552,176.552-176.552l0,0c97.506,0,176.552,79.044,176.552,176.552v105.931 C432.552,472.478,393.029,512,344.276,512z"
                    />
                    <path
                      style={{ fill: "#A0C88C" }}
                      d="M291.31,331.386v-51.654c13.614,5.231,22.069,13.071,22.069,20.405 c0,7.31,5.927,13.241,13.241,13.241c7.315,0,13.241-5.931,13.241-13.241c0-21.684-19.649-39.926-48.552-48.2v-9.18 c0-7.31-5.927-13.241-13.241-13.241c-7.315,0-13.241,5.931-13.241,13.241v4.693c-2.898-0.183-5.842-0.279-8.828-0.279 s-5.93,0.096-8.828,0.279v-4.693c0-7.31-5.927-13.241-13.241-13.241s-13.241,5.931-13.241,13.241v9.18 c-28.903,8.274-48.552,26.517-48.552,48.2c0,21.683,19.649,39.926,48.552,48.2v51.654c-13.614-5.231-22.069-13.071-22.069-20.405 c0-7.31-5.927-13.241-13.241-13.241s-13.241,5.931-13.241,13.241c0,21.684,19.649,39.926,48.552,48.2v9.18 c0,7.31,5.927,13.241,13.241,13.241s13.241-5.931,13.241-13.241v-4.693c2.898,0.183,5.842,0.279,8.828,0.279s5.93-0.096,8.828-0.279 v4.693c0,7.31,5.927,13.241,13.241,13.241c7.315,0,13.241-5.931,13.241-13.241v-9.18c28.903-8.274,48.552-26.517,48.552-48.2 C339.862,357.903,320.213,339.66,291.31,331.386z M256,273.655c3.017,0,5.963,0.12,8.828,0.344v52.9 c-2.898-0.183-5.842-0.279-8.828-0.279c-3.017,0-5.963-0.12-8.828-0.344v-52.277C250.037,273.775,252.983,273.655,256,273.655z M198.621,300.138c0-7.333,8.455-15.175,22.069-20.405v40.811C207.075,315.312,198.621,307.471,198.621,300.138z M256,406.069 c-3.017,0-5.963-0.12-8.828-0.344v-52.9c2.898,0.183,5.842,0.279,8.828,0.279c3.017,0,5.963,0.12,8.828,0.344v52.277 C261.963,405.948,259.017,406.069,256,406.069z M291.31,399.991V359.18c13.614,5.231,22.069,13.071,22.069,20.405 C313.379,386.918,304.925,394.761,291.31,399.991z"
                    />
                    <path
                      style={{ fill: "#FFEBBE" }}
                      d="M256,132.367L256,132.367c-34.127,0-61.793-27.666-61.793-61.793V8.837 c0-6.337,6.479-10.611,12.305-8.114l46.01,19.719c2.22,0.951,4.734,0.951,6.955,0l46.01-19.719 c5.826-2.497,12.306,1.775,12.306,8.114v61.737C317.793,104.702,290.127,132.367,256,132.367z"
                    />
                    <g>
                      <path
                        style={{ fill: "#F5DCAA" }}
                        d="M256,141.198c-1.345,0-2.694-0.31-3.932-0.922c-2.182-1.086-21.578-11.706-31.116-49.906 c-1.181-4.733,1.694-9.517,6.426-10.698c4.694-1.19,9.526,1.689,10.702,6.422c5.035,20.163,13.086,30.508,17.927,35.181 c4.793-4.638,12.866-14.983,17.909-35.181c1.185-4.724,6.008-7.612,10.702-6.422c4.733,1.181,7.608,5.965,6.427,10.698 c-9.539,38.198-28.936,48.819-31.116,49.906C258.693,140.888,257.345,141.198,256,141.198z"
                      />
                      <path
                        style={{ fill: "#F5DCAA" }}
                        d="M282.478,176.5c-2.259,0-4.518-0.862-6.241-2.586l-20.242-20.242l-20.242,20.242 c-3.448,3.448-9.035,3.448-12.483,0s-3.448-9.035,0-12.483l26.483-26.483c3.448-3.448,9.035-3.448,12.483,0l26.483,26.483 c3.448,3.448,3.448,9.035,0,12.483C286.996,175.638,284.737,176.5,282.478,176.5z"
                      />
                    </g>
                    <path
                      style={{ fill: "#B9785F" }}
                      d="M286.896,150.069h-61.793c-7.313,0-13.241-5.929-13.241-13.241l0,0 c0-7.313,5.929-13.241,13.241-13.241h61.793c7.313,0,13.241,5.929,13.241,13.241l0,0 C300.138,144.14,294.209,150.069,286.896,150.069z"
                    />
                  </svg>


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
import React, { useEffect, useState } from "react";
import formatNumber from "../../../../../utils";
import getFinancialAdvice from "../../../../../utils/getFinancialAdvice";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";

function CardInfo({ budgetList, incomeList, currentUserEmail }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expectedSavings, setExpectedSavings] = useState(0);
  const [actualSavings, setActualSavings] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    // Calculate total income for the current user
    if (incomeList.length && currentUserEmail) {
      const userIncome = incomeList
        .filter((income) => income.createdBy === currentUserEmail)
        .reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
      setTotalIncome(userIncome);
    }
  }, [incomeList, currentUserEmail]);

  const calculateCardInfo = (income) => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;

    // Calculate total budget and spend
    budgetList.forEach((element) => {
      totalBudget_ += parseFloat(element.amount || 0);
      totalSpend_ += parseFloat(element.totalSpend || 0);
    });

    // Calculate savings
    const expectedSavings_ = income - totalBudget_;
    const actualSavings_ = income - totalSpend_;

    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    setExpectedSavings(expectedSavings_);
    setActualSavings(actualSavings_);
  };

  // Trigger card info calculation whenever totalIncome or budget/income lists change
  useEffect(() => {
    if (totalIncome > 0 || budgetList.length > 0) {
      calculateCardInfo(totalIncome);
    }
  }, [totalIncome, budgetList]);

  // Fetch financial advice based on updated totals
  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const fetchFinancialAdvice = async () => {
        const advice = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );
        setFinancialAdvice(advice);
      };
      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend]);

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex mb-2 flex-row space-x-1 items-center ">
                <h2 className="text-md ">Finance Tracker AI</h2>
                <Sparkles
                  className="rounded-full text-white w-10 h-10 p-2 bg-gradient-to-r from-green-400 via-green-500 to-green-700 background-animate"
                />
              </div>
              <h2 className="font-light text-md">
                {financialAdvice || "Loading financial advice..."}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">
                  Ksh.{formatNumber(totalBudget)}
                </h2>
              </div>
              <PiggyBank className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Spend</h2>
                <h2 className="font-bold text-2xl">
                  Ksh.{formatNumber(totalSpend)}
                </h2>
              </div>
              <ReceiptText className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">No. Of Budget</h2>
                <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
              </div>
              <Wallet className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">
                  Ksh.{formatNumber(totalIncome)}
                </h2>
              </div>
              <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Expected Savings</h2>
                <h2 className="font-bold text-2xl">
                  Ksh.{formatNumber(expectedSavings)}
                </h2>
              </div>
              <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Actual Savings</h2>
                <h2 className="font-bold text-2xl">
                  Ksh.{formatNumber(actualSavings)}
                </h2>
              </div>
              <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;


// import formatNumber from "../../../../../utils";
// import getFinancialAdvice from "../../../../../utils/getFinancialAdvice";
// import {
//   PiggyBank,
//   ReceiptText,
//   Wallet,
//   Sparkles,
//   CircleDollarSign,
// } from "lucide-react";

// import React, { useEffect, useState } from "react";

// function CardInfo({ budgetList, incomeList, currentUserEmail }) {
//   const [totalBudget, setTotalBudget] = useState(0);
//   const [totalSpend, setTotalSpend] = useState(0);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [expectedSavings, setExpectedSavings] = useState(0);
//   const [actualSavings, setActualSavings] = useState(0);
//   const [financialAdvice, setFinancialAdvice] = useState("");

//   useEffect(() => {
//     if (incomeList.length && currentUserEmail) {
//       // Calculate income for the current user only, converting amounts to numbers
//       const userIncome = incomeList
//         .filter((income) => income.createdBy === currentUserEmail)
//         .reduce((sum, income) => sum + Number(income.amount), 0);
//       setTotalIncome(userIncome);
//     }
//   }, [incomeList, currentUserEmail]);

//   useEffect(() => {
//     if (budgetList.length > 0 || incomeList.length > 0) {
//       CalculateCardInfo();
//     }
//   }, [budgetList, incomeList]);

//   useEffect(() => {
//     if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
//       const fetchFinancialAdvice = async () => {
//         const advice = await getFinancialAdvice(
//           totalBudget,
//           totalIncome,
//           totalSpend
//         );
//         setFinancialAdvice(advice);
//       };

//       fetchFinancialAdvice();
//     }
//   }, [totalBudget, totalIncome, totalSpend]);

//   const CalculateCardInfo = () => {
//     let totalBudget_ = 0;
//     let totalSpend_ = 0;
//     let expectedSavings_ = 0;
//     let actualSavings_ = 0;

//     // Calculate total budget and total spend
//     budgetList.forEach((element) => {
//       totalBudget_ = totalBudget_ + Number(element.amount);
//       totalSpend_ = totalSpend_ + element.totalSpend;
//     });

//     // Calculate expected savings and actual savings
//     expectedSavings_ = totalIncome - totalBudget_;
//     actualSavings_ = totalIncome - totalSpend_;

//     setTotalBudget(totalBudget_);
//     setTotalSpend(totalSpend_);
//     setExpectedSavings(expectedSavings_);
//     setActualSavings(actualSavings_);
//   };

//   return (
//     <div>
//       {budgetList?.length > 0 ? (
//         <div>
//           <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
//             <div className="">
//               <div className="flex mb-2 flex-row space-x-1 items-center ">
//                 <h2 className="text-md ">Finance Tracker AI</h2>
//                 <Sparkles
//                   className="rounded-full text-white w-10 h-10 p-2 
//             bg-gradient-to-r
//             from-green-400 
//             via-green-500 
//             to-green-700 
//             background-animate"
//                 />
//               </div>
//               <h2 className="font-light text-md">
//                 {financialAdvice || "Loading financial advice..."}
//               </h2>
//             </div>
//           </div>

//           <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">Total Budget</h2>
//                 <h2 className="font-bold text-2xl">
//                   Ksh.{formatNumber(totalBudget)}
//                 </h2>
//               </div>
//               <PiggyBank className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">Total Spend</h2>
//                 <h2 className="font-bold text-2xl">
//                   Ksh.{formatNumber(totalSpend)}
//                 </h2>
//               </div>
//               <ReceiptText className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">No. Of Budget</h2>
//                 <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
//               </div>
//               <Wallet className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">Sum of Income Streams</h2>
//                 <h2 className="font-bold text-2xl">
//                   Ksh.{formatNumber(totalIncome)}
//                 </h2>
//               </div>
//               <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//             {/* Expected Savings Card */}
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">Expected Savings</h2>
//                 <h2 className="font-bold text-2xl">
//                   Ksh.{formatNumber(expectedSavings)}
//                 </h2>
//               </div>
//               <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//             {/* Actual Savings Card */}
//             <div className="p-7 border rounded-2xl flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm">Actual Savings</h2>
//                 <h2 className="font-bold text-2xl">
//                   Ksh.{formatNumber(actualSavings)}
//                 </h2>
//               </div>
//               <CircleDollarSign className="bg-green-500 p-3 h-12 w-12 rounded-full text-white" />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {[1, 2, 3].map((item, index) => (
//             <div
//               className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
//               key={index}
//             ></div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CardInfo;

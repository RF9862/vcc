import clsx from "clsx";
import React from "react";
import {
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdPayment,
} from "react-icons/md";

export default function FinancialStatistics({
  balance,
  totalDeposit,
  depositProcessing,
}) {
  const financialStatisticsData = [
    {
      title: "Balance",
      value: `$${balance}`,
      icon: <MdAccountBalanceWallet className="text-white w-8 h-8" />,
      iconBg: "bg-green-500",
    },
    {
      title: "Total deposit",
      value: `$${totalDeposit}`,
      icon: <MdAttachMoney className="text-white w-8 h-8" />,
      iconBg: "bg-red-500",
    },
    {
      title: "Deposit processed",
      value: `$${depositProcessing}`,
      icon: <MdPayment className="text-white w-8 h-8" />,
      iconBg: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-slate-900 shadow p-4 rounded-lg mb-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Financial Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialStatisticsData.map(({ title, value, icon, iconBg }, idx) => (
          <div
            key={`financial-statistic-data-${idx}`}
            className="text-center p-4 border rounded-lg bg-slate-800"
          >
            <div
              className={clsx(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2",
                iconBg
              )}
            >
              {icon}
            </div>
            <p className="font-semibold">{title}</p>
            <p className="text-lg">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

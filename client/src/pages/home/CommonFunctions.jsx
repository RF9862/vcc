import clsx from "clsx";
import React from "react";
import { FaList, FaMoneyCheckAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const commonFunctionsData = [
  {
    title: "Account Deposit",
    href: "/dashboard/wallet",
    icon: <FaMoneyCheckAlt className="text-white w-8 h-8" />,
    iconBg: "bg-yellow-500",
  },
  {
    title: "Quick card opening",
    href: "/dashboard/card",
    icon: <FaPlus className="text-white w-8 h-8" />,
    iconBg: "bg-yellow-500",
  },
  {
    title: "Card List",
    href: "/dashboard/card",
    icon: <FaList className="text-white w-8 h-8" />,
    iconBg: "bg-yellow-500",
  },
];

export default function CommonFunctions() {
  return (
    <div className="bg-slate-900 shadow p-4 rounded-lg mb-4">
      <h3 className="text-lg text-white font-semibold mb-4">
        Common Functions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {commonFunctionsData.map(({ title, icon, href, iconBg }, idx) => (
          <Link
            key={`common-function-item-${idx}`}
            to={href}
            className="flex-1 text-center p-4 border rounded-lg bg-slate-800 shadow hover:shadow-md text-white"
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
          </Link>
        ))}
      </div>
    </div>
  );
}

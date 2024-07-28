import React from "react";

import BalanceCard from "./BalanceCard";
import FundingDetails from "./FundingDetails";

export default function MoneyManagement() {
  return (
    <div className="p-4 space-y-4">
      <BalanceCard />
      <FundingDetails />
    </div>
  );
}

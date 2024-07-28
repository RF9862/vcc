import React, { useState } from "react";

import OrderFilter from "./OrderFilter";
import OrderTable from "./OrderTable";

export default function Order() {
  const [statusSelected, setStatusSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-blue-500">Order</h1>
      <OrderFilter
        status={statusSelected}
        onChangeStatus={setStatusSelected}
        query={searchQuery}
        onChangeQuery={setSearchQuery}
      />
      <OrderTable status={statusSelected} remark={searchQuery} />
    </div>
  );
}

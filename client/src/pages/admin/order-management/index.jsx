import React from "react";

import OrderList from "./OrderList";

export default function OrderManagement() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <OrderList />
    </div>
  );
}

import React from "react";

import UserList from "./UserList";

export default function UserManagement() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserList />
    </div>
  );
}

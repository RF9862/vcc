import React from "react";
import { Helmet } from "react-helmet-async";
import { Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <Outlet />
    </>
  );
}

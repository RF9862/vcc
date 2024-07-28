import React from "react";
import { Helmet } from "react-helmet-async";

import CardSearch from "./CardSearch";
import OpenCardAndStats from "./OpenCardAndStats";

export default function CardListPage() {
  return (
    <>
      <Helmet>
        <title>Cards</title>
      </Helmet>
      <div className="p-4 space-y-4">
        <OpenCardAndStats />
        <CardSearch />
      </div>
    </>
  );
}

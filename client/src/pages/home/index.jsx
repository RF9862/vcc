import React, { useEffect, useState } from "react";
import { FaPagelines } from "react-icons/fa";

import { useAuth } from "../../components/AppProvider";
import axios from "../../config/axios";
import CommonFunctions from "./CommonFunctions";
import FinancialStatistics from "./FinancialStatistics";
import KindTips from "./KindTips";
import UserLevel from "./UserLevel";

export default function Home() {
  const { user } = useAuth();
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [newCardFee, setNewCardFee] = useState(0);
  const [topupFee, setTopupFee] = useState(0);
  useEffect(() => {
    const init = async () => {
      const ordersRes = await axios.get("/order/get-orders", {
        params: {
          all: "true",
        },
      });
      setTotalDeposit(
        ordersRes.data
          .filter((order) => order.type === "deposit")
          .reduce((acc, order) => (acc += order.changeAmount), 0)
      );

      const feeRes = await axios.get("/get-fee");
      if (feeRes.data) {
        const { newCardFee, topupFee } = feeRes.data;
        setNewCardFee(newCardFee);
        setTopupFee(topupFee);
      }
    };
    init();
  }, []);

  return (
    <>
      <div className="p-4">
        <KindTips />

        <div className="shadow p-4 rounded-lg mb-4 bg-slate-800">
          <h2 className="text-xl font-semibold mb-2 flex justify-center items-center text-white">
            <FaPagelines color="#eab308" size={40} />
            Welcome back,{" "}
            <span className="text-yellow-500 px-2">{user.email}!</span>
          </h2>
        </div>

        <CommonFunctions />
        <FinancialStatistics
          balance={user.balance}
          totalDeposit={totalDeposit}
          depositProcessing={totalDeposit - user.balance}
        />
        <UserLevel newCardFee={newCardFee} topupFee={topupFee} />
      </div>
    </>
  );
}

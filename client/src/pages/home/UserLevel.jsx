import React from "react";

export default function UserLevel({ newCardFee, topupFee }) {
  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg mb-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Card Fee Information</h3>
      <div className="flex justify-around items-center text-center">
        <div className="flex-1">
          <p className="font-semibold">{Math.round(topupFee * 10000) / 100}%</p>
          <p className="text-yellow-500">Recharging</p>
        </div>
        <div className="h-12 border-r border-gray-300"></div>
        <div className="flex-1">
          <p className="font-semibold">${newCardFee}</p>
          <p className="text-yellow-500">Opening</p>
        </div>
      </div>
    </div>
  );
}

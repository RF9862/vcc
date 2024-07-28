import React from "react";

export default function OrderFilter({
  status,
  onChangeStatus,
  query,
  onChangeQuery,
}) {
  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Remark"
          className="flex-1 p-2 border rounded-lg"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
        />
        <select
          className={`select-placeholder flex-1 p-2 border rounded-lg ${
            status === "" ? "text-gray-500" : "text-black"
          }`}
          value={status}
          onChange={(e) => onChangeStatus(e.target.value)}
        >
          <option value="" className="text-gray-500" disabled>
            Type
          </option>
          <option value="new_card">New Card</option>
          <option value="recharge">Recharge</option>
        </select>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600">
          Search
        </button>
      </div>
    </div>
  );
}

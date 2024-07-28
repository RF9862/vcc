import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

import axios from "../../../config/axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    email: "",
    type: "",
    remark: "",
    startDate: "",
    endDate: "",
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/admin/get-orders", {
        params: {
          page,
          ...searchParams,
        },
      });
      setTotalPages(res.data.totalPages);
      setOrders(res.data.docs);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchParams]);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handlePageClick = ({ selected }) => {
    setPage(selected + 1);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4 bg-slate-900">
      <h1 className="text-2xl font-bold mb-4 text-white">Order Management</h1>
      <form className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={searchParams.email}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={searchParams.type}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="deposit">Deposit</option>
              <option value="new_card">New Card</option>
              <option value="recharge">Recharge</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="remark">
              Remark
            </label>
            <input
              id="remark"
              name="remark"
              type="text"
              value={searchParams.remark}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={searchParams.startDate}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={searchParams.endDate}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </form>
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">User Email</th>
            <th className="py-2">Type</th>
            <th className="py-2">Remark</th>
            <th className="py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-gray-700">
              <td className="py-2 px-4">{order._id}</td>
              <td className="py-2 px-4">{order.userId.email}</td>
              <td className="py-2 px-4">{order.type}</td>
              <td className="py-2 px-4">{order.remark}</td>
              <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default OrderList;

import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import axios from "../../config/axios";

export default function OrderTable({ status, remark }) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, status, remark]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/order/get-orders", {
        params: {
          page: currentPage,
          type: status || ["new_card", "recharge"],
          remark,
        },
      });
      setOrders(res.data.docs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-800 shadow p-4 rounded-lg">
      <table className="w-full table-auto text-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Remark</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2 text-center">
                  {order.changeAmount < 0 ? "-" : ""}$
                  {Math.round(Math.abs(order.changeAmount) * 100000) / 100000}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.type === "new_card" ? "New Card" : "Recharge"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {moment(order.createdAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="border px-4 py-2 text-center">
                  {order.remark ?? "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="7">
                <img
                  src="/img/empty-table.png"
                  alt="No data"
                  className="mx-auto"
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ReactPaginate
        className="pagination mt-8 p-2"
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
